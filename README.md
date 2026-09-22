# Requirements

- Node.js 22.22.2 or later
- npm

## Installation

```bash
git clone https://github.com/Bablione/purple_cross_ltd.git
cd purple_cross_ltd
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Available commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Check TypeScript and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the automated tests once |
| `npm run test:watch` | Run tests in watch mode |

The automated tests cover date utilities and employee store operations.

## Resetting demo data

Use **Reload JSON** in the header and confirm the dialog to restore the sample employees. This replaces changes saved in this browser.

## Features

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

## Folder structure

```text
In src
  components/   Reusable components
  data/         Initial employee JSON file
  router/       Application routes
  stores/       Pinia state management store
  types/        TypeScript interfaces (models)
  utils/        Date and status internal logic functions
  views/        App level pages
```

## Routes

```text
/                    Employee list
/employees/new       Create an employee
/employees/:id        View employee details
/employees/:id/edit   Edit an employee
```

Unknown routes display Not Found View

## Architecture

The application uses a simple component-based structure.

Views represent complete pages, while components contain reusable elements (form, tables).

Pinia stores the data and handles the CRUD operations.

Vue Router is for navigation between pages.

JSON file is the original data source.

Changes are saved to localStorage for persistence.

## Why Bootstrap?

Bootstrap provides consistent styling, responsive layouts, and utility classes. It keeps custom CSS minimal and lets the implementation focus on employee-management functionality.

## Validation

The employee form checks that:

- Employee code is required
- Employee code is unique
- Full name is required
- Full name contains at least three characters
- Occupation is required
- Department is required
- Employment date is required and must be valid
- Termination date is valid when supplied
- Termination date is not before the employment date
- Validation messages are displayed next to the relevant fields.

## Date handling

The application treats dates as calendar dates rather than UTC timestamps.

A value such as 2026-09-28 is split before creating a local date. This avoids dates changing because of timezone differences.

Employment beginning today is treated as currently employed. Termination taking effect today is treated as terminated. Once an employee is terminated, the “Currently employed” label is hidden.

## Known limitations

There is no backend or database

Data is stored separately in each browser

Clearing browser storage removes saved changes