# Development Rules

These rules are **compulsory** and must be followed in all development work on this project.

## 1. Type Safety Rules

- **`any` type is strictly prohibited**
  - All variables, function parameters, and return types must be explicitly typed
  - Use proper TypeScript interfaces, types, or generics instead of `any`
  - If uncertain about a type, use `unknown` and perform proper type checking

## 2. Server Component Architecture

- **`page.tsx` and `layout.tsx` are strictly server components**
  - No client-side actions or hooks allowed in these files
  - No `useState`, `useEffect`, `onClick` handlers, or other client-side React features
  - Use `"use client"` directive only in dedicated client components

## 3. Server Actions Organization

- **All Firebase and Cloudinary functions must be server actions in an `actions/` folder**
  - Create highly reusable server action functions (e.g., `uploadDocument`, `deleteDocument`, `createUser`, etc.)
  - Each action should be focused on a single responsibility
  - Actions must be properly typed with input validation
  - Example structure:
    ```
    actions/
    ├── firebase/
    │   ├── addDocument.ts
    │   ├── getDocument.ts
    │   ├── getDocuments.ts
    │   ├── updateDocument.ts
    │   ├── deleteDocument.ts
    │   ├── queryDocuments.ts
    │   ├── addToSubcollection.ts
    │   ├── getSubcollection.ts
    │   ├── updateInSubcollection.ts
    │   └── deleteFromSubcollection.ts
    ├── cloudinary/
    │   ├── upload.ts
    │   └── delete.ts
    └── index.ts
    ```
  - Actions should be robust to handle full CRUD operations
  - Each action file should contain comprehensive error handling and validation

## 4. Data Fetching Architecture

- **All data fetching must use server actions**
  - Data fetching should occur in `layout.tsx` or `page.tsx` files
  - Data must be passed down to child components as props
  - Alternative: Use data provider wrappers (React Context) for client-side data sharing
  - No direct API calls from client components
  - Example pattern:
    ```tsx
    // page.tsx (server component)
    export default async function PropertyPage({ params }: { params: { id: string } }) {
      const property = await getDocument(params.id);      
      return (
        <DataPuser={user}>
          <PropertyDetails />
        </DataProvider>
      );
    }
    ```

## Enforcement

These rules are non-negotiable and must be followed in:
- All new code
- Code reviews
- Refactoring work
- Bug fixes

Violations of these rules will require immediate correction before code can be merged.