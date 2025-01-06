import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/repo/user/${userId}`
        );
        setRepositories(response.data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/all`);
        setSuggestedRepositories(response.data);
        console.log(suggestedRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo: any) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "60px" }}>
        {" "}
        {/* Adjust marginTop as needed */}
        <section id="dashboard">
          <aside>
            <h3>Suggested Repositories</h3>
            {suggestedRepositories.map((repo: any) => {
              return (
                <div key={repo.id}>
                  <h4>{repo.name}</h4>
                  <h4>{repo.description}</h4>
                </div>
              );
            })}
          </aside>
          <main>
            <h2>Your Repositories</h2>
            <div id="search">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.map((repo: any) => {
              return (
                <div key={repo.id}>
                  <h4>{repo.name}</h4>
                  <h4>{repo.description}</h4>
                </div>
              );
            })}
          </main>
          <aside>
            <h3>Upcoming Events</h3>
            <ul>
              <li>
                <p>Tech Conference - Dec 15</p>
              </li>
              <li>
                <p>Developer Meetup - Dec 25</p>
              </li>
              <li>
                <p>React Summit - Jan 5</p>
              </li>
            </ul>
          </aside>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
