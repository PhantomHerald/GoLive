-- Stream Viewers Table
CREATE TABLE stream_viewers (
                                stream_id INT NOT NULL,
                                user_id INT NOT NULL,
                                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (stream_id, user_id),
                                FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat Messages Table
CREATE TABLE chat_messages (
                               id SERIAL PRIMARY KEY,
                               stream_id INT NOT NULL,
                               user_id INT NOT NULL,
                               message TEXT NOT NULL,
                               sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description TEXT
);

-- Stream Categories Table
CREATE TABLE stream_categories (
                                   stream_id INT NOT NULL,
                                   category_id INT NOT NULL,
                                   PRIMARY KEY (stream_id, category_id),
                                   FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
                                   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Likes Table
CREATE TABLE likes (
                       id SERIAL PRIMARY KEY,
                       user_id INT NOT NULL,
                       video_id INT,
                       stream_id INT,
                       liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
                       FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
                       CHECK (
                           (video_id IS NOT NULL AND stream_id IS NULL) OR
                           (video_id IS NULL AND stream_id IS NOT NULL)
                           )
);

-- Comments Table
CREATE TABLE comments (
                          id SERIAL PRIMARY KEY,
                          user_id INT NOT NULL,
                          video_id INT,
                          stream_id INT,
                          message TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
                          FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
                          CHECK (
                              (video_id IS NOT NULL AND stream_id IS NULL) OR
                              (video_id IS NULL AND stream_id IS NOT NULL)
                              )
);

-- Reports Table
CREATE TABLE reports (
                         id SERIAL PRIMARY KEY,
                         user_id INT NOT NULL,
                         video_id INT,
                         stream_id INT,
                         comment_id INT,
                         reason TEXT NOT NULL,
                         reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
                         FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
                         FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
                         CHECK (
                             (video_id IS NOT NULL AND stream_id IS NULL AND comment_id IS NULL) OR
                             (video_id IS NULL AND stream_id IS NOT NULL AND comment_id IS NULL) OR
                             (video_id IS NULL AND stream_id IS NULL AND comment_id IS NOT NULL)
                             )
);
