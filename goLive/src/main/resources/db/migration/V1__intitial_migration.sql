--  Users table
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels table
CREATE TABLE channels (
                          id SERIAL PRIMARY KEY,
                          user_id INT NOT NULL,
                          name VARCHAR(100) NOT NULL,
                          description TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--  Streams table
CREATE TABLE streams (
                         id SERIAL PRIMARY KEY,
                         channel_id INT NOT NULL,
                         title VARCHAR(150),
                         start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         end_time TIMESTAMP,
                         is_live BOOLEAN DEFAULT TRUE,
                         FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);

--  Videos table
CREATE TABLE videos (
                        id SERIAL PRIMARY KEY,
                        channel_id INT NOT NULL,
                        title VARCHAR(150),
                        url TEXT NOT NULL,
                        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);

-- ❤ Follows table
CREATE TABLE follows (
                         id SERIAL PRIMARY KEY,
                         user_id INT NOT NULL,
                         channel_id INT NOT NULL,
                         followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         UNIQUE (user_id, channel_id),
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);
