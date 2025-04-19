# Student TPO Management Portal A web application for managing Training and Placement Office activities. 

## Project Setup ### Prerequisites 
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

  
### Installation 1. Clone the repository: 
```bash git clone <repository-url> cd student_tpo_mp ``` 

Install dependencies: ```bash 

# Install backend dependencies cd backend npm install 
# Install frontend dependencies cd ../frontend npm install ``` 

Environment Setup: 
- Create a `.env` file in the root directory 


- Add the following configuration: ```

NODE_ENV=development PORT=5000
MONGO_URI=mongodb://localhost:27017/student_tpo_db
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key ``` 


### Running the Application 
1. Start the backend server: ```bash cd backend npm start ```
2. Start the frontend development server: ```bash cd frontend npm run dev ```


The application will be available at: - 

Frontend: http://localhost:3000
Backend API: http://localhost:5000 


## Contributing 
1. Create a new branch for your feature: ```bash git checkout -b feature/your-feature-name ```
2. Make your changes and commit them: ```bash git add . git commit -m "Add your commit message" ```
3. Push to your branch: ```bash git push origin feature/your-feature-name ```
4. 4. Create a Pull Request on GitHub ## Project Structure ```

├── backend/           
# Backend server code │   
├── config/        
# Configuration files │   
├── middleware/    
# Express middlewares │   
├── models/        
# MongoDB models │   
├── routes/        
# API routes │   
└── services/      
# Business logic 
├── frontend/          
# React frontend │   
├── src/ │   
│   ├── components/ │   
│   ├── store/     
# Redux store │   
│   └── App.jsx └── .env             
# Environment variables ```
