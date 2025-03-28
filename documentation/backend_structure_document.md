# Backend Structure Document for Sensay Hackathon Ideas Showcase UI

## 1. Backend Architecture

The backend is designed using a modern serverless approach, which leverages Next.js API routes and Vercel Serverless Functions (with the option of Supabase Edge Functions when needed). The architecture is modular, meaning each functionality (authentication, data fetching, and mocking external services) is encapsulated in a small, dedicated function that can be maintained and scaled independently.

- Utilizes a serverless design that scales automatically with traffic.
- Clear separation of concerns: each serverless function handles a specific API endpoint or task.
- Easily maintainable, as functions are implemented following common design patterns and can be updated individually without affecting the entire system.
- Performance is optimized by running on Vercel’s global edge network, ensuring low latency responses.

## 2. Database Management

The project uses Supabase backed by PostgreSQL, a relational database system, to store and manage persistent data. Data management is designed to be straightforward, ensuring that all information is structured for easy access and integrity.

- **Technology:** PostgreSQL hosted through Supabase.
- **Data Storage:** Stores user information, conversation histories, task lists, and prototype-specific data.
- **Data Access:** Uses standard SQL queries to interact with the database. Supabase provides a RESTful interface for additional ease of integration.
- **Best Practices:** Indexing on key fields, regular backups, and data encryption in transit and at rest are implemented.

## 3. Database Schema

### Human-Readable Schema Overview

- **Users Table:** Stores user details like user ID, email, hashed passwords (managed by Supabase Auth), and profile information.
- **Conversations Table:** Records conversation histories including user messages, replica messages, timestamps, and conversation IDs.
- **Tasks Table:** Maintains separate lists of tasks fetched from and updated in Supabase, including task descriptions, statuses, and associated user IDs.
- **Prototype Data Table:** Contains information related to prototype interactions such as bonding status, token interactions, and any mock actions performed.

### SQL Schema (PostgreSQL)

Below is an example SQL script to set up the basic database schema:

```
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  sender VARCHAR(50) NOT NULL,  -- 'user' or 'replica'
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prototype Interactions Table
CREATE TABLE IF NOT EXISTS prototype_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  interaction_type VARCHAR(100),  -- e.g., 'mock_voice', 'bonding', etc.
  details JSONB,                  -- store various interaction details
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. API Design and Endpoints

The backend exposes RESTful APIs via Next.js API routes. These endpoints allow the frontend to interact seamlessly with both third-party APIs (like Sensay API) and the internal database and authentication mechanisms.

- **Design Approach:** RESTful endpoints are used to keep communication simple and predictable, with each endpoint representing a specific resource or operation.
- **Key Endpoints Include:**
  - **/api/auth:** Handles user sign-up, login, and logout using Supabase Auth. 
  - **/api/conversations:** Retrieves and posts messages for conversation history, including sender and timestamp details.
  - **/api/tasks:** Fetches and manages the task list for replica tasks.
  - **/api/prototype/[id]:** Handles data specific to each of the 7 prototype ideas. This includes mocked endpoints for activities such as starting voice interactions, bonding replicas, and triggering chatroom functions.
  - **/api/mock:** Endpoints for simulating interactions with placeholder or mock data, such as Web3 and telephony actions.

Each endpoint receives data from the frontend and processes it, either interacting with the database or triggering a mock response to simulate behavior.

## 5. Hosting Solutions

The backend is hosted primarily on Vercel, which provides a robust and scalable solution for deploying serverless functions. Additionally, Supabase handles database and authentication services.

- **Vercel:**
  - Provides serverless function hosting and global edge network distribution.
  - Ensures high reliability and cost-effectiveness as you scale.
  - Seamless integration with Next.js, making deployment and updates straightforward.

- **Supabase:**
  - Manages PostgreSQL databases, providing real-time capabilities and built-in authentication services.
  - Offers a simplified interface for database management and user authentication.

## 6. Infrastructure Components

Several components work together to ensure that the backend delivers high performance and a smooth user experience:

- **Serverless Functions:** Next.js API routes deployed on Vercel, ensuring functions spin-up quickly and scale automatically.
- **Load Balancers:** Integrated within Vercel’s platform to distribute incoming traffic effectively across serverless functions.
- **Caching Mechanisms:** Vercel and Supabase both offer caching strategies to reduce latency and improve response times.
- **Content Delivery Network (CDN):** Vercel’s global edge network serves assets quickly across different geographical locations.
- **Environment Management:** Sensitive information like API keys and database credentials are managed through environment variables (e.g., SENSAY_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY) ensuring configurations are secure.

## 7. Security Measures

Security is a top priority, and several measures are implemented to protect both the application and the user data:

- **Authentication and Authorization:**
  - Supabase Auth is used to manage user sign-up, login, and session management.
  - Endpoints are protected to ensure that only authenticated users can access sensitive data.

- **Data Encryption:**
  - All data in transit is encrypted using HTTPS.
  - Sensitive data stored in the database (such as tokens) is protected through proper encryption and access policies.

- **Environment Variables:**
  - Securely managed environment variables in Vercel ensure that API keys and secrets are never exposed in the codebase.

- **Compliance:**
  - Adheres to best practices for data privacy and regulatory guidelines where applicable.

## 8. Monitoring and Maintenance

Maintaining a reliable backend involves continuous monitoring and regular updates:

- **Monitoring Tools:**
  - Vercel Analytics and logs offer performance tracking and error reporting for serverless functions.
  - Supabase provides database monitoring and real-time logs to track API usage and performance.

- **Maintenance Strategies:**
  - Regular reviews and updates of serverless functions, endpoints, and database indices.
  - Scheduled backups and automated alerts on unusual activity to ensure data integrity and availability.
  - Use of version control and CI/CD pipelines to continually integrate improvements without downtime.

## 9. Conclusion and Overall Backend Summary

The backend for the Sensay Hackathon Ideas Showcase UI is designed with scalability, security, and performance in mind. By leveraging a serverless architecture on Vercel alongside Supabase-managed PostgreSQL databases and authentication, the system is both robust and agile.

- The use of Next.js API routes provides a clear separation between frontend and backend logic, making the application modular and maintainable.
- Database management via Supabase ensures reliable data storage with best practices in security and performance.
- Comprehensive RESTful endpoints facilitate smooth communication between the UI and backend services.
- Hosting on Vercel with integrated infrastructure components like load balancing and CDNs guarantees that the application will perform well, even under scaling conditions.
- Rigorous security measures protect user data and provide a trusted environment for both real and simulated interactions.

This backend architecture not only meets the project goals but also provides a strong foundation for further enhancements as the project evolves.
