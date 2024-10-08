import React, { useEffect, useRef, useState, useCallback } from "react";
import { faker } from "@faker-js/faker";

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Error Boundary Caught an Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="border border-red-500 bg-red-100 text-red-700 p-4"
          role="alert"
        >
          <h2>Something went wrong.</h2>
          <p>Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface User {
  id: string;
  name: string;
  address: string;
  phone: string;
  errors: number;
}

const RandomData: React.FC = () => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [region, setRegion] = useState<string>("USA");
  const countries = ["Georgia (Country)", "Poland", "USA"];
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000));
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [totalUsers, setTotalUsers] = useState<number>(20);

  const handleSliderValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  const handleNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), 1000);
    setSliderValue(value);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(event.target.value);
  };

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000));
  };

  const loadMoreUsers = () => {
    setTotalUsers((prev) => prev + 10);
  };

  const generateUser = useCallback((): User => {
    let errors = 0;
    if (sliderValue > 0 && Math.random() < sliderValue / 10) {
      errors++;
    }

    let name = faker.person.fullName();
    let address = `${faker.location.city()}, ${faker.location.streetAddress()}`;
    let phone = faker.phone.number();

    // Generate data based on the selected region
    switch (region) {
      case "Georgia (Country)":
        name = `${faker.person.firstName()} ${faker.person.lastName()}`;
        address = `${faker.location.city()}, ${faker.location.country()}`;
        phone = faker.phone.number({ style: "international" });
        break;
      case "Poland":
        name = `${faker.person.firstName()} ${faker.person.lastName()}`;
        address = `${faker.location.streetAddress()}, ${faker.location.city()}, Poland`;
        phone = faker.phone.number({ style: "international" });
        break;
      case "USA":
      default:
        break;
    }

    if (errors > 0) {
      if (Math.random() > 0.5) name += "XX";
      if (Math.random() > 0.5) address = address.replace(/\d/g, "0");
      if (Math.random() > 0.5) phone = phone.replace(/\d/g, "X");
    }

    return {
      id: faker.string.uuid(),
      name,
      address,
      phone,
      errors,
    };
  }, [sliderValue, region]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        faker.seed(seed);
        const newUsers = Array.from({ length: totalUsers }, generateUser);
        setUsers(newUsers);
      } catch (error) {
        console.error("Error generating users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region, sliderValue, seed, totalUsers, generateUser]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      console.warn(
        "IntersectionObserver is not supported in this environment."
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreUsers();
        }
      },
      { threshold: 1.0 }
    );

    const loadingElement = loadingRef.current;
    if (loadingElement) observer.observe(loadingElement);
    return () => {
      if (loadingElement) observer.unobserve(loadingElement);
    };
  }, [loadingRef]);

  return (
    <ErrorBoundary>
      <div className="max-w-3xl mx-auto p-5">
        <h1 className="text-2xl font-bold mb-4">Random User Data Generator</h1>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="error-rate">
            Error Rate (0-10):
          </label>
          <input
            id="error-rate"
            type="range"
            value={sliderValue}
            onChange={handleSliderValue}
            min={0}
            max={10}
            className="w-full mb-2"
            aria-label="Error Rate Slider"
            aria-valuemin={0}
            aria-valuemax={10}
            aria-valuenow={sliderValue}
          />
          <span className="inline-block mb-2">{sliderValue}</span>
          <input
            type="number"
            value={sliderValue}
            min={0}
            max={1000}
            onChange={handleNumberInput}
            className="border border-gray-300 rounded p-2 w-full"
            aria-label="Error Rate Number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="region" className="block mb-1">
            Choose Region:
          </label>
          <select
            id="region"
            value={region}
            onChange={handleRegionChange}
            className="border border-gray-300 rounded p-2 w-full"
            aria-label="Select Region"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <button
            type="button"
            onClick={generateRandomSeed}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Generate Random Seed
          </button>
          <span className="ml-4">Seed: {seed}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Generated Users</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Index</th>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Address</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Errors</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{user.id}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.address}</td>
                  <td className="border border-gray-300 p-2">{user.phone}</td>
                  <td className="border border-gray-300 p-2">{user.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p>Loading more users...</p>}
          <div ref={loadingRef}></div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RandomData;
