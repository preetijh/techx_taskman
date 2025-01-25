from flask import Flask, render_template, request, redirect, session,flash
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re

app = Flask(__name__)

# Secret key for session management
app.secret_key = 'your_secret_key'

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'abc123'
app.config['MYSQL_DB'] = 'techx'

mysql = MySQL(app)

@app.route('/')
def home():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get form data
        email = request.form['username']
        password = request.form['password']

        # Query database
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM users WHERE Email = %s AND Password = %s', (email, password))
        user = cursor.fetchone()

        if user:
            # Set session variables
            session['loggedin'] = True
            session['id'] = user['id']
            session['email'] = user['Email']
            session['full_name'] = user['Full Name']
            session['role'] = user['Role']
            session['team'] = user['Team']
            session['profile_image'] = user['Profile Image']

            # Redirect based on role
            if user['Role'] == 'admin':
                return redirect('/admin-dashboard')
            else:
                return redirect('/user-dashboard')
        else:
            # Handle invalid login
            return render_template('login.html', error='Invalid email or password')

    return render_template('login.html')



# @app.route('/admin-dashboard', methods=['GET', 'POST'])
# def admin_dashboard():
#     if 'loggedin' in session and session['role'] == 'admin':
#         cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

#         # Total tasks
#         cursor.execute("SELECT COUNT(*) as total_tasks FROM tasks")
#         total_tasks = cursor.fetchone()['total_tasks']

#         # Completed tasks
#         cursor.execute("SELECT COUNT(*) as completed_tasks FROM tasks t JOIN user_task_status uts ON t.id = uts.task_id WHERE uts.status = 'Completed'")
#         completed_tasks = cursor.fetchone()['completed_tasks']

#         # Total users
#         cursor.execute("SELECT COUNT(*) as total_users FROM users")
#         total_users = cursor.fetchone()['total_users']

#         # Active teams
#         cursor.execute("SELECT COUNT(*) as active_teams FROM teams WHERE status = 'active'")
#         active_teams = cursor.fetchone()['active_teams']

#         cursor.execute('''
#             SELECT 
#                 t.id, t.task_title, 
#                 u.`Full Name` AS assigned_to, 
#                 t.due_date, 
#                 ts.status, 
#                 CASE 
#                     WHEN ts.status = 'Completed' THEN 'success'
#                     WHEN ts.status = 'In Progress' THEN 'warning'
#                     ELSE 'secondary' 
#                 END AS status_badge 
#             FROM 
#                 tasks t
#             LEFT JOIN 
#                 users u ON t.assign_to = u.id
#             LEFT JOIN 
#                 user_task_status ts ON t.id = ts.task_id
#             ORDER BY t.id DESC 
             
#         ''')
#         recent_tasks = cursor.fetchall()

#         cursor.close()  # Close the cursor after all queries

#         return render_template('admin-dashboard.html', recent_tasks=recent_tasks, full_name=session['full_name'], role=session['role'], total_tasks=total_tasks, completed_tasks=completed_tasks, total_users=total_users, active_teams=active_teams)

        
#         if request.method == 'POST':
#             if 'full_name' in request.form:
#                 # Add new user
#                 full_name = request.form['full_name']
#                 email = request.form['email']
#                 password = request.form['password']
#                 role = request.form['role']
#                 team = request.form['team']
#                 profile_image = request.form.get('profile_image', 'default_user.png') 

#                 # Validate inputs
#                 if not full_name or not email or not password or not role or not team:
#                     flash('All fields are required!')
#                     return redirect('/admin-dashboard')

#                 # Insert user into the database
                
#                 cursor.execute('''INSERT INTO users (`Full Name`, Email, Password, Role, Team, `Profile Image`) 
#                                      VALUES (%s, %s, %s, %s, %s, %s)''', 
#                                      (full_name, email, password, role, team, profile_image))
#                 mysql.connection.commit()
#                 cursor.close()

#                 flash('User added successfully!')
#                 return redirect('/admin-dashboard')

#             elif 'teamName' in request.form:
#                 # Create new team
#                 team_name = request.form['teamName']
#                 description = request.form['teamDescription']
#                 leader_id = request.form['teamLeader']
#                 member_ids = ','.join(request.form.getlist('teamMembers')) 
#                 team_color = request.form['teamColor']
#                 department = request.form['teamDepartment']

#                 # Validate inputs
#                 if not team_name or not description or not leader_id or not department:
#                     flash('All fields are required for team creation!')
#                     return redirect('/admin-dashboard')

#                 # Insert into teams table
#                 cursor.execute('''INSERT INTO teams (team_name, description, leader_id, member_ids, team_color, department)
#                                      VALUES (%s, %s, %s, %s, %s, %s)''',
#                                      (team_name, description, leader_id, member_ids, team_color, department))
#                 mysql.connection.commit()
#                 cursor.close()

#                 flash('Team created successfully!')
#                 return redirect('/admin-dashboard')

#         cursor.close()

#         return render_template('admin-dashboard.html', 
#                                full_name=session['full_name'], 
#                                role=session['role'], 
#                                total_tasks=total_tasks, 
#                                completed_tasks=completed_tasks, 
#                                total_users=total_users, 
#                                active_teams=active_teams)
#     else:
#         return redirect('/login')
    
@app.route('/admin-dashboard', methods=['GET', 'POST'])
def admin_dashboard():
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        # Total tasks
        cursor.execute("SELECT COUNT(*) as total_tasks FROM tasks")
        total_tasks = cursor.fetchone()['total_tasks']

        # Completed tasks
        cursor.execute("SELECT COUNT(*) as completed_tasks FROM tasks t JOIN user_task_status uts ON t.id = uts.task_id WHERE uts.status = 'Completed'")
        completed_tasks = cursor.fetchone()['completed_tasks']

        # Total users
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()['total_users']

        # Active teams
        cursor.execute("SELECT COUNT(*) as active_teams FROM teams WHERE status = 'active'")
        active_teams = cursor.fetchone()['active_teams']

        # Fetch recent tasks
        cursor.execute('''
            SELECT 
                t.id, t.task_title, 
                u.`Full Name` AS assigned_to, 
                t.due_date, 
                ts.status, 
                CASE 
                    WHEN ts.status = 'Completed' THEN 'success'
                    WHEN ts.status = 'In Progress' THEN 'warning'
                    ELSE 'secondary' 
                END AS status_badge 
            FROM 
                tasks t
            LEFT JOIN 
                users u ON t.assign_to = u.id
            LEFT JOIN 
                user_task_status ts ON t.id = ts.task_id
            ORDER BY t.id DESC 
        ''')
        recent_tasks = cursor.fetchall()

        if request.method == 'POST':
            if 'full_name' in request.form:
                # Add new user
                full_name = request.form['full_name']
                email = request.form['email']
                password = request.form['password']
                role = request.form['role']
                team = request.form['team']
                profile_image = request.form.get('profile_image', 'default_user.png') 

                # Validate inputs
                if not full_name or not email or not password or not role or not team:
                    flash('All fields are required!')
                    cursor.close()
                    return redirect('/admin-dashboard')

                # Insert user into the database
                cursor.execute('''INSERT INTO users (`Full Name`, Email, Password, Role, Team, `Profile Image`) 
                                  VALUES (%s, %s, %s, %s, %s, %s)''', 
                               (full_name, email, password, role, team, profile_image))
                mysql.connection.commit()

                flash('User added successfully!')
                cursor.close()
                return redirect('/admin-dashboard')

            elif 'teamName' in request.form:
                # Create new team
                team_name = request.form['teamName']
                description = request.form['teamDescription']
                leader_id = request.form['teamLeader']
                member_ids = ','.join(request.form.getlist('teamMembers')) 
                team_color = request.form['teamColor']
                department = request.form['teamDepartment']

                # Validate inputs
                if not team_name or not description or not leader_id or not department:
                    flash('All fields are required for team creation!')
                    cursor.close()
                    return redirect('/admin-dashboard')

                # Insert into teams table
                cursor.execute('''INSERT INTO teams (team_name, description, leader_id, member_ids, team_color, department)
                                  VALUES (%s, %s, %s, %s, %s, %s)''',
                               (team_name, description, leader_id, member_ids, team_color, department))
                mysql.connection.commit()

                flash('Team created successfully!')
                cursor.close()
                return redirect('/admin-dashboard')

        cursor.close()
        return render_template('admin-dashboard.html', 
                               recent_tasks=recent_tasks, 
                               full_name=session['full_name'], 
                               role=session['role'], 
                               total_tasks=total_tasks, 
                               completed_tasks=completed_tasks, 
                               total_users=total_users, 
                               active_teams=active_teams)

    else:
        return redirect('/login')


@app.route('/dashboard-teams', methods=['GET', 'POST'])
def dashboard_teams():
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        if request.method == 'POST':
            # Retrieve form data for creating a new team
            team_name = request.form['teamName']
            department = request.form['teamDepartment']
            description = request.form['teamDescription']
            leader_id = request.form['teamLeader']
            member_ids = ','.join(request.form.getlist('teamMembers'))  # Comma-separated string for multiple members
            team_color = request.form['teamColor']
            status = request.form['teamStatus']

            # Validation
            if not team_name or not department or not leader_id or not team_color or not status:
                flash('Please fill in all required fields!')
                return redirect('/dashboard-teams')

            # Insert into the teams table
            cursor.execute(
                """
                INSERT INTO teams (team_name, department, description, leader_id, member_ids, team_color, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (team_name, department, description, leader_id, member_ids, team_color, status)
            )
            mysql.connection.commit()
            flash('Team created successfully!')
            return redirect('/dashboard-teams')

        # Fetch all teams and their related leader data
        cursor.execute("""
            SELECT teams.*, 
                   users.`Full Name` AS leader_name 
            FROM teams 
            LEFT JOIN users ON teams.leader_id = users.id
        """)
        teams = cursor.fetchall()

        # For each team, fetch the member names
        for team in teams:
            if team['member_ids']:  # Check if there are member IDs
                member_ids = team['member_ids'].split(',')
                cursor.execute(
                    "SELECT `Full Name` FROM users WHERE id IN (%s)" % ','.join(['%s'] * len(member_ids)),
                    member_ids
                )
                members = cursor.fetchall()
                team['member_names'] = ', '.join([member['Full Name'] for member in members])
            else:
                team['member_names'] = "No members assigned"

        # Fetch all users for dropdowns (for team leader and members)
        cursor.execute("SELECT id, `Full Name` FROM users")
        users = cursor.fetchall()

        cursor.close()
        return render_template('dashboard-teams.html', teams=teams, users=users)

    return redirect('/login')

@app.route('/teams', methods=['GET', 'POST'])
def teams():
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        if request.method == 'POST':
            # Retrieve form data
            team_name = request.form['teamName']
            department = request.form['teamDepartment']
            description = request.form['teamDescription']
            leader_id = request.form['teamLeader']
            member_ids = ','.join(request.form.getlist('teamMembers'))  # Comma-separated string for multiple members
            team_color = request.form['teamColor']
            status = request.form['teamStatus']

            # Validation
            if not team_name or not department or not leader_id or not team_color or not status:
                flash('Please fill in all required fields!')
                return redirect('/teams')

            # Insert into the teams table
            cursor.execute(
                """
                INSERT INTO teams (team_name, department, description, leader_id, member_ids, team_color, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (team_name, department, description, leader_id, member_ids, team_color, status)
            )
            mysql.connection.commit()
            flash('Team created successfully!')
            return redirect('/teams')

        # Fetch all teams and related leader data
        cursor.execute("""
            SELECT teams.*, 
                   users.`Full Name` AS leader_name 
            FROM teams 
            LEFT JOIN users ON teams.leader_id = users.id
        """)
        teams = cursor.fetchall()

        # For each team, fetch the member names
        for team in teams:
            if team['member_ids']:  # Check if there are member IDs
                member_ids = team['member_ids'].split(',')
                cursor.execute(
                    "SELECT `Full Name` FROM users WHERE id IN (%s)" % ','.join(['%s'] * len(member_ids)),
                    member_ids
                )
                members = cursor.fetchall()
                team['member_names'] = ', '.join([member['Full Name'] for member in members])
            else:
                team['member_names'] = "No members assigned"

        # Fetch all users for dropdowns (for team leader and members)
        cursor.execute("SELECT id, `Full Name` FROM users")
        users = cursor.fetchall()

        cursor.close()
        return render_template('teams.html', teams=teams, users=users)
    return redirect('/login')

@app.route('/add-members/<int:team_id>', methods=['POST'])
def add_members(team_id):
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        # Get the member IDs from the form
        member_ids = request.form.getlist('teamMembers')

        if member_ids:
            # Get the current members of the team
            cursor.execute('SELECT member_ids FROM teams WHERE id = %s', (team_id,))
            team = cursor.fetchone()

            # Add new members to the existing list, avoiding duplicates
            current_members = set(team['member_ids'].split(',')) if team['member_ids'] else set()
            new_members = current_members.union(member_ids)

            # Update the team's member list
            cursor.execute('UPDATE teams SET member_ids = %s WHERE id = %s', (','.join(new_members), team_id))
            mysql.connection.commit()
            cursor.close()

            flash('Members added successfully!')
        else:
            flash('No members selected to add.')

        return redirect('/teams')
    
    return redirect('/login')

@app.route('/users')
def users():
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM users")
        users_data = cursor.fetchall()
        cursor.close()
        return render_template('users.html', users=users_data)
    return redirect('/login')

@app.route('/add_user', methods=['POST'])
def add_user():
   if 'loggedin' in session and session['role'] == 'admin':
        if request.method == 'POST':
            if 'full_name' in request.form:
                # Add new user
                full_name = request.form['full_name']
                email = request.form['email']
                password = request.form['password']
                role = request.form['role']
                team = request.form['team']
                profile_image = request.form.get('profile_image', 'default_user.png')  # Default image if not provided

                # Validate inputs
                if not full_name or not email or not password or not role or not team:
                    flash('All fields are required!')
                    return redirect('/users')

                # Insert user into the database
                cursor = mysql.connection.cursor()
                cursor.execute('''INSERT INTO users (`Full Name`, Email, Password, Role, Team, `Profile Image`) 
                                  VALUES (%s, %s, %s, %s, %s, %s)''', 
                               (full_name, email, password, role, team, profile_image))
                mysql.connection.commit()
                cursor.close()

                flash('User added successfully!')
                return redirect('/user')

            elif 'teamName' in request.form:
                # Create new team
                team_name = request.form['teamName']
                description = request.form['teamDescription']
                leader_id = request.form['teamLeader']
                member_ids = ','.join(request.form.getlist('teamMembers'))  # Multiple member IDs stored as a comma-separated string
                team_color = request.form['teamColor']
                department = request.form['teamDepartment']

                # Validate inputs
                if not team_name or not description or not leader_id or not department:
                    flash('All fields are required for team creation!')
                    return redirect('/user')

                # Insert into teams table
                cursor = mysql.connection.cursor()
                cursor.execute('''INSERT INTO teams (team_name, description, leader_id, member_ids, team_color, department)
                                  VALUES (%s, %s, %s, %s, %s, %s)''',
                               (team_name, description, leader_id, member_ids, team_color, department))
                mysql.connection.commit()
                cursor.close()

                flash('Team created successfully!')
                return redirect('/user')

        return render_template('user.html', full_name=session['full_name'])
   return redirect('/login')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    #session['full_name'] = user['Full Name']
    #session['role'] = user['Role']
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        if request.method == 'POST':
            task_title = request.form['taskTitle']
            priority = request.form['priority']
            description = request.form['description']
            assign_to = request.form['assignTo']
            team_id = request.form['teamId']
            start_date = request.form['startDate']
            due_date = request.form['dueDate']
            attachments = request.form['attachments']  # Attachments description or filename

            if not task_title or not priority or not description or not assign_to or not team_id or not start_date or not due_date:
                flash('All fields are required!')
                return redirect('/tasks')

            
            
            cursor.execute(''' 
                INSERT INTO tasks (task_title, priority, description, assign_to, team_id, start_date, due_date, attachments)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ''', (task_title, priority, description, assign_to, team_id, start_date, due_date, attachments))
            mysql.connection.commit()
            
            task_id = cursor.lastrowid
            
            cursor.execute(''' 
                INSERT INTO user_task_status (task_id, status, task_name) 
                VALUES (%s, 'Pending', %s)
            ''', (task_id, task_title)) 
            
            mysql.connection.commit()
            cursor.close()

            flash('Task created successfully!')
            return redirect('/tasks')  # Redirect to the tasks page instead of admin dashboard
        
           # Fetch all tasks with their status
        cursor.execute('''
            SELECT t.id, t.task_title, t.priority, t.description, t.start_date, t.due_date, t.assign_to, ts.status
            FROM tasks t
            LEFT JOIN user_task_status ts ON t.id = ts.task_id
        ''')
        tasks = cursor.fetchall()

        # Fetch all users and teams for dropdowns
        cursor.execute("SELECT id, `Full Name` FROM users")  # Use backticks for column names with spaces
        users = cursor.fetchall()
        cursor.execute("SELECT id, team_name FROM teams")
        teams = cursor.fetchall()

        cursor.close()
        return render_template('tasks.html', users=users, teams=teams, tasks=tasks)

    return redirect('/login')

@app.route('/delete_task/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    if 'loggedin' in session and session['role'] == 'admin':
        cursor = mysql.connection.cursor()

        # Delete task from user_task_status table first
        cursor.execute(''' 
            DELETE FROM user_task_status WHERE task_id = %s
        ''', (task_id,))
        mysql.connection.commit()

        # Now delete the task from tasks table
        cursor.execute(''' 
            DELETE FROM tasks WHERE id = %s
        ''', (task_id,))
        mysql.connection.commit()

        cursor.close()
        flash('Task deleted successfully!')
        return redirect('/tasks')
    return redirect('/login')


def get_tasks_by_status(cursor):
    """
    Fetches tasks from the database grouped by their status.

    Args:
        cursor: A MySQLdb.cursors.DictCursor object.

    Returns:
        A tuple containing lists of tasks for each status:
            - pending_tasks
            - in_progress_tasks
            - review_tasks
            - completed_tasks
    """
    cursor.execute('''
        SELECT t.id, t.task_title 
        FROM tasks t
        LEFT JOIN user_task_status ts ON t.id = ts.task_id
        WHERE ts.status = 'Pending'
    ''')
    pending_tasks = cursor.fetchall()

    cursor.execute('''
        SELECT t.id, t.task_title 
        FROM tasks t
        LEFT JOIN user_task_status ts ON t.id = ts.task_id
        WHERE ts.status = 'In Progress'
    ''')
    in_progress_tasks = cursor.fetchall()

    cursor.execute('''
        SELECT t.id, t.task_title 
        FROM tasks t
        LEFT JOIN user_task_status ts ON t.id = ts.task_id
        WHERE ts.status = 'Review'
    ''')
    review_tasks = cursor.fetchall()

    cursor.execute('''
        SELECT t.id, t.task_title 
        FROM tasks t
        LEFT JOIN user_task_status ts ON t.id = ts.task_id
        WHERE ts.status = 'Completed'
    ''')
    completed_tasks = cursor.fetchall()

    return pending_tasks, in_progress_tasks, review_tasks, completed_tasks
# Route: User Dashboard

# @app.route('/user-dashboard')
# def user_dashboard():
#     if 'loggedin' in session and session['role'] != 'admin':
#         cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

#         user_id = session['id']

#         # Count of all tasks assigned to the user
#         cursor.execute('''
#             SELECT 
#                 COUNT(*) as total_tasks
#             FROM 
#                 tasks t
#             LEFT JOIN 
#                 user_task_status ts ON t.id = ts.task_id
#             WHERE 
#                 t.assign_to = %s OR 
#                 t.team_id IN (SELECT id FROM teams WHERE team_name IN (SELECT Team FROM users WHERE id = %s))
#         ''', (user_id, user_id))
#         total_tasks = cursor.fetchone()['total_tasks']

#         # Count of team members (assuming you have a 'member_ids' column in the 'teams' table)
#         cursor.execute('''
#             SELECT 
#                 COUNT(*) as team_members
#             FROM 
#                 users 
#             WHERE 
#                 id IN (SELECT member_ids FROM teams WHERE team_name IN (SELECT Team FROM users WHERE id = %s))
#         ''', (user_id,))
#         team_members = cursor.fetchone()['team_members']

#         # Count of completed tasks
#         cursor.execute('''
#             SELECT 
#                 COUNT(*) as completed_tasks
#             FROM 
#                 tasks t
#             LEFT JOIN 
#                 user_task_status ts ON t.id = ts.task_id
#             WHERE 
#                 (t.assign_to = %s OR 
#                 t.team_id IN (SELECT id FROM teams WHERE team_name IN (SELECT Team FROM users WHERE id = %s)))
#                 AND ts.status = 'Completed'
#         ''', (user_id, user_id))
#         completed_tasks = cursor.fetchone()['completed_tasks']

#         # Count of pending tasks
#         cursor.execute('''
#             SELECT 
#                 COUNT(*) as pending_tasks
#             FROM 
#                 tasks t
#             LEFT JOIN 
#                 user_task_status ts ON t.id = ts.task_id
#             WHERE 
#                 (t.assign_to = %s OR 
#                 t.team_id IN (SELECT id FROM teams WHERE team_name IN (SELECT Team FROM users WHERE id = %s)))
#                 AND ts.status = 'Pending'
#         ''', (user_id, user_id))
#         pending_tasks = cursor.fetchone()['pending_tasks']

#         #cursor.close()

#         # Get the user's team name
#         cursor.execute("SELECT Team FROM users WHERE id = %s", (user_id,))
#         user_team = cursor.fetchone()['Team']

#         # Get user's role
#         user_role = session['role'] 

#         return render_template('user-dashboard.html', 
#                                full_name=session['full_name'], 
#                                team=user_team, 
#                                total_tasks=total_tasks, 
#                                team_members=team_members, 
#                                completed_tasks=completed_tasks,
#                                pending_tasks=pending_tasks,
#                                role=user_role) 
#     return redirect('/login')
@app.route('/user-dashboard')
def user_dashboard():
    if 'loggedin' in session and session['role'] != 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        user_id = session['id']

        # Get the user's team name and role in a single query to avoid multiple executions
        cursor.execute('''
            SELECT u.Team, u.role 
            FROM users u
            WHERE u.id = %s
        ''', (user_id,))
        user_data = cursor.fetchone()
        user_team = user_data['Team']
        user_role = user_data['role']

        # Query for task counts (total, completed, pending) using a single query for efficiency
        cursor.execute('''
            SELECT 
                COUNT(*) AS total_tasks,
                SUM(CASE WHEN ts.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
                SUM(CASE WHEN ts.status = 'Pending' THEN 1 ELSE 0 END) AS pending_tasks
            FROM 
                tasks t
            LEFT JOIN 
                user_task_status ts ON t.id = ts.task_id
            WHERE 
                t.assign_to = %s OR 
                t.team_id IN (SELECT id FROM teams WHERE team_name = %s)
        ''', (user_id, user_team))

        task_counts = cursor.fetchone()
        total_tasks = task_counts['total_tasks']
        completed_tasks = task_counts['completed_tasks']
        pending_tasks = task_counts['pending_tasks']

        # Count team members by directly referencing team_name
        cursor.execute('''
            SELECT COUNT(*) AS team_members
            FROM users 
            WHERE Team = %s
        ''', (user_team,))
        team_members = cursor.fetchone()['team_members']

        cursor.close()

        return render_template('user-dashboard.html', 
                               full_name=session['full_name'], 
                               team=user_team, 
                               total_tasks=total_tasks, 
                               team_members=team_members, 
                               completed_tasks=completed_tasks,
                               pending_tasks=pending_tasks,
                               role=user_role) 
    return redirect('/login')


@app.route('/reports',methods=['GET', 'POST'])
def reports():
     return render_template('reports.html')
    #  return redirect('/reports')

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if 'loggedin' in session:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        if request.method == 'POST':
            email_to_update = request.form.get('email')
            new_email = request.form.get('new_email')
            new_password = request.form.get('new_password')

            # Update email if provided
            if email_to_update:
                try:
                    cursor.execute("UPDATE users SET Email = %s WHERE id = %s", (email_to_update, session['id']))
                    mysql.connection.commit()
                    flash('Email updated successfully!', 'success')
                except mysql.Error as err:
                    flash(f'Error updating email: {err}', 'danger')

            # Update new email
            if new_email:
                try:
                    cursor.execute("UPDATE users SET Email = %s WHERE id = %s", (new_email, session['id']))
                    mysql.connection.commit()
                    flash('New email updated successfully!', 'success')
                except mysql.Error as err:
                    flash(f'Error updating new email: {err}', 'danger')

            # Update password if provided
            if new_password:
                try:
                    cursor.execute("UPDATE users SET Password = %s WHERE id = %s", (new_password, session['id']))
                    mysql.connection.commit()
                    flash('Password updated successfully!', 'success')
                except mysql.Error as err:
                    flash(f'Error updating password: {err}', 'danger')

        # Fetch user data and all users for the form
        cursor.execute("SELECT * FROM users WHERE id = %s", (session['id'],))
        user = cursor.fetchone()

        cursor.execute("SELECT Email FROM users")
        all_users = cursor.fetchall()
        cursor.close()

        return render_template(
            'settings.html',
            full_name=user['Full Name'],
            user_email=user['Email'],
            user_image=user['Profile Image'],
            all_users=all_users
        )

    return redirect('/login')


@app.route('/logout',methods=['GET', 'POST'])
def logout():
    session.clear()
    return redirect('/login')



@app.route('/my-tasks', methods=['GET', 'POST'])
def my_tasks():
    if 'loggedin' in session:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        # Get the current user's ID
        user_id = session['id']

        # Fetch tasks assigned directly to the user
        cursor.execute(''' 
            SELECT 
                t.id, t.task_title, t.priority, t.description, t.start_date, t.due_date, t.assign_to, ts.status, 
                te.team_name
            FROM 
                tasks t
            LEFT JOIN 
                user_task_status ts ON t.id = ts.task_id
            LEFT JOIN 
                teams te ON t.team_id = te.id
            WHERE 
                t.assign_to = %s 
                OR FIND_IN_SET(%s, te.member_ids) > 0
                OR te.team_name = (SELECT Team FROM users WHERE id = %s)
        ''', (user_id, user_id, user_id))


        # Fetch tasks
        all_tasks = cursor.fetchall()
        


        return render_template('my-tasks.html', tasks=all_tasks)
    else:
        return redirect('/login') 
@app.route('/update_task_status/<int:task_id>', methods=['POST'])
def update_task_status(task_id):
    if 'loggedin' in session:
        if request.method == 'POST':
            new_status = request.form['new_status']

            cursor = mysql.connection.cursor()
            cursor.execute('''
                UPDATE user_task_status
                SET status = %s
                WHERE task_id = %s
            ''', (new_status, task_id))
            mysql.connection.commit()
            cursor.close()

            flash('Task status updated successfully!')
            return redirect('/my-tasks') 

    return redirect('/login')

@app.route('/my-team')
def my_team():
    if 'loggedin' in session:
        user_id = session['id']  # Logged-in user's ID

        # SQL query to fetch teams the user is part of
        query = """
        SELECT 
            te.id AS team_id,
            te.team_name,
            te.department,
            te.description,
            te.team_color,
            te.status,
            te.leader_id,
            (SELECT `Full Name` FROM users WHERE id = te.leader_id) AS leader_name,
            te.member_ids
        FROM 
            teams te
        WHERE 
            te.leader_id = %s OR FIND_IN_SET(%s, te.member_ids) > 0
        """

        # Execute query
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(query, (user_id, user_id))
        teams = cursor.fetchall()

        # Prepare a dictionary for leader details
        team_leads = {team['leader_id']: team['leader_name'] for team in teams}

        # Prepare a dictionary for team members
        member_ids = set()
        for team in teams:
            if team['member_ids']:
                member_ids.update(team['member_ids'].split(','))

        # Fetch all team member names from `users` table
        if member_ids:
            cursor.execute("SELECT id, `Full Name` FROM users WHERE id IN (%s)" % ','.join(member_ids))
            members = cursor.fetchall()
            team_members = {str(member['id']): member['Full Name'] for member in members}
        else:
            team_members = {}

        cursor.close()

        # Pass data to the template
        return render_template('my-team.html', teams=teams, team_leads=team_leads, team_members=team_members)

    return redirect('/login')



if __name__ == '__main__':
    app.run(debug=True)
