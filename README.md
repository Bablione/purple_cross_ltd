# Project Purpose

Creation and organization of an employee management system, composed of 
- a main dashboard
- a create/edit page
- a view page

# Requirements

- Node.js 20.19 or later
- npm

# Installation
Clone the repository and install the dependencies:

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
npm install


Start the development server:
npm run dev

# Available commands
npm run dev
Starts the development server.

npm run build
Checks the TypeScript code and creates a production build.

npm run preview
Runs the production build locally.

# Features
- View employees in a tabular way
- Filter by name, code, occupation, or department
- Sort table columns
- Client-side pagination
- Create employees / Edit employees
- View employee details
- Delete employees with approval modal
- Form validation
- Local storage persistence
- Responsive layout

# Folder structure
In src
  components/   Reusable components
  data/         Initial employee JSON file
  router/       Application routes
  stores/       Pinia state management store
  types/        TypeScript interfaces (models)
  utils/        Date and status internal logic functions
  views/        App level pages

# Routes
/	                  Employee list
/employees/new	      Create an employee
/employees/:id	      View employee details
/employees/:id/edit	  Edit an employee
Unknown routes display Not Found View

# Architecture
The application uses a simple component-based structure.

Views represent complete pages, while components contain reusable elements (form, tables).

Pinia stores the data and handles the CRUD operations. 
Vue Router is for navigation between pages.

JSON file is the original data source.
Changes are saved to localStorage for persistence.

# Why Bootstrap?
Provides consistent set of utilities, for a small size sample application, the use of custom hand made styling layer is not of use.

# Validation
The employee form checks that:

- Employee code is required
- Employee code is unique
- Full name is required
- Full name contains at least three characters
- Occupation is required
- Department is required
- Employment date is valid
- Termination date is valid when supplied
- Termination date is not before the employment date
- Validation messages are displayed next to the relevant fields.

# Date handling
The application treats dates as calendar dates rather than UTC timestamps.
A value such as 2026-09-28 is split before creating a local date. This avoids dates changing because of timezone differences.

# Known limitations
There is no backend or database
Data is stored separately in each browser
Clearing browser storage removes saved changes