create database techx;
use techx;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `Full Name` VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Team VARCHAR(50),
    `Profile Image` VARCHAR(255)
);
ALTER TABLE users CHANGE COLUMN `Full name` `Full Name` VARCHAR(255) NOT NULL;
ALTER TABLE users CHANGE COLUMN `Profile Image` `Profile Image` VARCHAR(255) NOT NULL;

INSERT INTO users (`Full Name`, Email, Password, Role, Team, `Profile Image`) 
VALUES 
('Admins', 'admin1@admin.com', 'admin', 'admin', 'Management', 'default_admin.png'),
('User', 'user@user.com', 'user', 'user', 'Management', 'default_admin.png');

select * from users;

CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    leader_id INT NOT NULL,
    member_ids TEXT NOT NULL,
    team_color VARCHAR(7) DEFAULT '#2563eb',
    status ENUM('active', 'on_hold', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES users(id)
);

select*from teams;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_title VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') NOT NULL,
    description TEXT,
    assign_to INT,  -- This will reference the users table
    team_id INT,    -- This will reference the teams table
    start_date DATE,
    due_date DATE,
    attachments TEXT,  -- For storing file names or descriptions of attachments
    FOREIGN KEY (assign_to) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
select * from tasks;
ALTER TABLE tasks CHANGE COLUMN `task name` `task_title` VARCHAR(255) NOT NULL;

CREATE TABLE user_task_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,        -- This will reference the tasks table
    status ENUM('Pending', 'In Progress', 'Completed', 'Review') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
select * from user_task_status;

ALTER TABLE user_task_status ADD task_name VARCHAR(255);