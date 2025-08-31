# Gitea UI Clone in Next.js

## 1. Project Purpose

The primary goal of this project is to create a high-fidelity, interactive frontend for Gitea, built with Next.js and modern frontend technologies. The application will replicate the user interface and functionality of Gitea's repository pages, treating a Gitea instance as a headless backend by interacting exclusively with its official API.

This project serves as a practical implementation of a "headless" Git service, demonstrating how to build a custom, performant, and maintainable user experience on top of a robust backend like Gitea. The final product will be a standalone web application that can browse repositories, view files, and inspect commit histories from a target Gitea instance.

## 2. Core Technologies

This project will be built using a modern, type-safe, and component-driven stack to ensure a high-quality developer experience and a robust final product.

- **Framework:** **Next.js (App Router)**
- **Language:** **TypeScript**
- **UI Component Library:** **Shadcn/ui**
- **Icons Library:** **lucide-react**
- **State Managment:** **Zustand**

- **Styling:** **Tailwind CSS**
- **Data Fetching:**
  - **Next.js Server Actions:**
  - **Axios:**

## 3. Data Source & Development Target

For development and testing purposes, this project will target the official Gitea demo instance. This provides a stable and publicly accessible data source without the need for local setup.

- **API Endpoint:** `https://demo.gitea.com/api/v1`
- **Target Repository (Example):** `https://demo.gitea.com/ericLemanissier/conan-center-index`

All components will be built and tested against the data structures returned by this live API.
