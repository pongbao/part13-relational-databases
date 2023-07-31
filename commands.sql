CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Nexval Infotech','https://nexval.com/how-title-companies-can-make-smarter-faster-decisions/','How Title Companies Can Make Smarter, Faster Decisions');

INSERT INTO blogs (author, url, title) VALUES ('WritEon','https://medium.com/@andreik7/the-luckiest-man-in-the-world-df04b86e40f?_branch_match_id=1169225132606600180&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXz8nMy9bLTU3JLM3VS87P1Q8tzk7McLHMLqtMAgBv5%2FjzIwAAAA%3D%3D','The luckiest man in the world');


