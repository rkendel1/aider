# Integration Examples

This document shows practical examples of using the Aider + Code-Server + Supabase setup.

## Example 1: Building a Todo App with Supabase

### 1. Create the Database Schema

Connect to PostgreSQL and create a table:

```bash
# Connect to database
docker exec -it docker-supabase-db-1 psql -U postgres

# Create a table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

# Grant access
GRANT ALL ON todos TO anon;
GRANT ALL ON todos TO authenticated;
```

### 2. Use Aider to Generate Frontend Code

In code-server, open the Aider chat and ask:

```
Create a simple HTML page that uses Supabase to display and manage todos.
Use the Supabase REST API at http://localhost:8000
The anon key is in the environment variable SUPABASE_ANON_KEY
```

Aider will generate code similar to:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <h1>My Todos</h1>
    <div id="todos"></div>
    <input id="newTodo" placeholder="New todo...">
    <button onclick="addTodo()">Add</button>
    
    <script>
        const supabase = window.supabase.createClient(
            'http://localhost:8000',
            'YOUR_ANON_KEY'
        );
        
        async function loadTodos() {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error:', error);
                return;
            }
            
            displayTodos(data);
        }
        
        async function addTodo() {
            const title = document.getElementById('newTodo').value;
            const { error } = await supabase
                .from('todos')
                .insert([{ title }]);
            
            if (!error) {
                document.getElementById('newTodo').value = '';
                loadTodos();
            }
        }
        
        function displayTodos(todos) {
            const container = document.getElementById('todos');
            container.innerHTML = todos.map(todo => `
                <div>
                    <input type="checkbox" 
                           ${todo.completed ? 'checked' : ''}
                           onchange="toggleTodo(${todo.id}, this.checked)">
                    ${todo.title}
                </div>
            `).join('');
        }
        
        async function toggleTodo(id, completed) {
            await supabase
                .from('todos')
                .update({ completed })
                .eq('id', id);
        }
        
        loadTodos();
    </script>
</body>
</html>
```

### 3. Test Your App

1. Save the file in `/workspace/todo.html`
2. Open in browser: http://localhost:8443/todo.html (served by code-server)
3. Or create a simple HTTP server:

```javascript
// server.js
const express = require('express');
const app = express();
app.use(express.static('.'));
app.listen(3000, () => console.log('Server on http://localhost:3000'));
```

## Example 2: Using Aider's Cache to Reduce Costs

### Understanding the Cache

Aider caches:
- API responses
- File content hashes
- Conversation context

### Example: Iterative Development

```bash
# First request - uses API tokens
"Add error handling to the todo list"
# Cache miss - full token cost

# Similar request later
"Add better error messages to the todo list"
# Cache hit on file context - reduced token cost

# Exact same request
"Add error handling to the todo list"
# Full cache hit - minimal token cost
```

### Monitor Cache Usage

```bash
# Check cache size
make shell
du -sh /home/coder/.aider/cache

# View cache files
ls -la /home/coder/.aider/cache

# Clear cache if needed
rm -rf /home/coder/.aider/cache/*
```

## Example 3: Real-time Updates with Supabase

### 1. Ask Aider to Add Realtime

```
Add Supabase realtime subscriptions so the todo list updates automatically 
when other users add or complete todos
```

### 2. Aider Generates:

```javascript
// Subscribe to changes
const subscription = supabase
    .channel('todos_channel')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
            console.log('Change received!', payload);
            loadTodos();
        }
    )
    .subscribe();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    subscription.unsubscribe();
});
```

## Example 4: Authentication Flow

### 1. Set Up Auth

```bash
# In code-server terminal
docker exec -it docker-supabase-db-1 psql -U postgres

# Create users table (Supabase Auth handles this, but you can extend it)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Ask Aider:

```
Add user authentication to the todo app using Supabase Auth.
Include sign up, sign in, and sign out functionality.
Only show todos for the logged-in user.
```

### 3. Aider Creates:

```javascript
// Sign up
async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    if (error) console.error('Error:', error);
    return data;
}

// Sign in
async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) console.error('Error:', error);
    return data;
}

// Sign out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error:', error);
}

// Get current user
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Modified loadTodos to filter by user
async function loadTodos() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    displayTodos(data);
}
```

## Example 5: File Upload with Supabase Storage

### 1. Ask Aider:

```
Add file upload functionality to attach files to todos using Supabase Storage
```

### 2. Generated Code:

```javascript
async function uploadFile(file, todoId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${todoId}/${Math.random()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
        .from('todo-attachments')
        .upload(fileName, file);
    
    if (error) {
        console.error('Upload error:', error);
        return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('todo-attachments')
        .getPublicUrl(fileName);
    
    return publicUrl;
}

// HTML for file input
<input type="file" id="fileInput" onchange="handleFileUpload()">

async function handleFileUpload() {
    const file = document.getElementById('fileInput').files[0];
    const todoId = getCurrentTodoId(); // Your logic here
    const url = await uploadFile(file, todoId);
    
    if (url) {
        // Update todo with attachment URL
        await supabase
            .from('todos')
            .update({ attachment_url: url })
            .eq('id', todoId);
    }
}
```

## Example 6: Using Environment Variables

### In Code-Server

```javascript
// Access environment variables that were passed to the container
// Note: In browser context, you'll need to expose them via your server

// In Node.js backend
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
```

### Passing to Frontend

Create an API endpoint:

```javascript
// server.js
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    });
});

// In your frontend
async function initSupabase() {
    const config = await fetch('/api/config').then(r => r.json());
    return window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
}
```

## Example 7: Debugging with Aider

### Ask Aider to Help Debug:

```
I'm getting a "permission denied" error when trying to insert todos. 
Can you help me debug this?
```

Aider will:
1. Check your database permissions
2. Examine the Supabase RLS (Row Level Security) policies
3. Suggest fixes

Example fix:

```sql
-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own todos"
ON todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own todos"
ON todos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
ON todos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
ON todos FOR DELETE
USING (auth.uid() = user_id);
```

## Example 8: Working with Multiple Projects

### Switch Between Projects

```bash
# Stop current setup
docker compose down

# Edit docker-compose.yml to mount your project
# Change:
#   - workspace:/workspace
# To:
#   - /path/to/your/project:/workspace

# Start again
docker compose up -d
```

### Or Use Multiple Workspaces

```yaml
# In docker-compose.yml, you can create multiple volume mounts
volumes:
  - workspace:/workspace
  - /path/to/project1:/workspace/project1
  - /path/to/project2:/workspace/project2
```

## Best Practices

### 1. Use Aider Effectively

- **Be specific**: Instead of "add a feature", say "add a delete button to each todo item"
- **Iterate**: Make small changes and test frequently
- **Review code**: Always review what Aider generates
- **Use cache**: Similar requests benefit from caching

### 2. Supabase Security

- **Use RLS**: Always enable Row Level Security in production
- **Rotate secrets**: Change JWT_SECRET and keys regularly
- **Use HTTPS**: In production, enable SSL
- **Separate environments**: Use different databases for dev/prod

### 3. Development Workflow

1. Start the environment: `docker compose up -d`
2. Open code-server: http://localhost:8443
3. Use Aider to generate code
4. Test in the browser
5. Iterate with Aider
6. Commit your changes (git is available in the container)

### 4. Performance

- Clear cache periodically: `rm -rf /home/coder/.aider/cache/*`
- Monitor container resources: `docker stats`
- Stop unused services: `docker compose stop supabase-*`
- Use specific models: Set `AIDER_MODEL` for faster/cheaper models

## Troubleshooting Integration Issues

### CORS Errors

If you get CORS errors:

```javascript
// Make sure your Supabase URL is correct
const supabaseUrl = 'http://localhost:8000'; // Not http://supabase-kong:8000

// If still having issues, check Kong CORS configuration
```

### Database Connection Issues

```bash
# Test database connection
docker exec -it docker-supabase-db-1 psql -U postgres -c "SELECT 1"

# Check if Kong can reach database
docker exec -it docker-supabase-kong-1 curl http://supabase-db:5432
```

### Aider Not Responding

```bash
# Check API status
curl http://localhost:5000/api/health

# Restart Aider
docker exec -it docker-code-server-1 supervisorctl restart aider-api

# Check logs
docker exec -it docker-code-server-1 supervisorctl tail -f aider-api
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Aider Documentation](https://aider.chat/docs)
- [Code-Server Documentation](https://coder.com/docs/code-server)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Contributing Examples

Have a cool integration example? Add it to this file and submit a PR!
