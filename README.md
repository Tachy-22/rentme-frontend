Here’s the **full detailed version**, crafted as if you were writing the official Rentme product definition or handoff doc.

---

# 🏠 **Rentme — Web Platform for Student Rentals**

### **Overview**

**Rentme** is a web-based platform that connects verified student renters with trusted real estate agents around Nigerian campuses.
It’s designed to help students easily find off-campus accommodation and give agents a structured, transparent way to reach verified student clients.

The system runs as a **desktop web app** with three primary user roles:

1. **Renters (Students)** – browse listings, contact agents, and get matched to suitable apartments.
2. **Agents** – upload and manage property listings, chat with renters, and grow their visibility through verification.
3. **Admin** – oversees verifications, listings, and user activities.

---

## ⚙️ **AUTHENTICATION & REGISTRATION FLOW**

### 1. **Login & Signup**

* Single sign-on with **Google authentication** (email-based).
* Returning users → redirected to their role-specific dashboard.
* New users → directed to a registration form.

### 2. **Registration Form**

Common fields for both roles:

* Full Name
* Email (auto-filled from Google)
* Phone Number (optional)
* Select Role: **Renter** or **Agent**

#### If Renter:

* University name
* Preferred location / area
* Accommodation type (Self-con, Shared room, etc.)
* Budget range

#### If Agent:

* Agency name or personal brand name
* Coverage areas (multi-select)
* Property types handled (apartments, student hostels, etc.)
* Typical price range

Once submitted → user is logged in → redirected to main dashboard.
A **top-banner prompt** appears:

> “Get verified to unlock full access and visibility.”

---

## 🧍‍♂️ **RENTER EXPERIENCE**

### 🎯 Goal:

Find available properties, connect with agents, and verify identity for faster response and priority access.

### Main Pages / Sections

1. **🏡 Explore / Listings Page**

   * Full-page property catalog with sidebar filters:

     * Location, price range, property type, and agent rating.
   * Each property card includes:

     * Image preview
     * Rent price
     * Verification badge
     * “View Details” button
   * Hover reveals quick actions: “Message Agent,” “Save,” “Report.”
   * Verified agents’ listings appear first in results.

2. **📄 Property Details Page**

   * Large photo gallery (carousel style).
   * Description, amenities, and agent info.
   * “Message Agent” button → opens right-side chat drawer or separate chat page.
   * For **unverified renters**, agent contact details are partially blurred.

3. **💬 Messages Page**

   * Two-column layout: left column for conversation list, right for active chat.
   * Renter can message agents directly from listings or saved chats.
   * Unverified renters can send **up to 3 messages per week**.
   * Verified renters get **unlimited messaging** and faster delivery.

4. **🧾 Verification Page**

   * Upload form: student ID or admission letter.
   * Dropdown: University, Department, Level.
   * Shows current verification status (Pending / Verified / Rejected).
   * Progress indicator and helpful note:

     > “Verification helps agents trust you faster.”

5. **👤 Profile Page**

   * Displays renter info, preferences, and verification badge.
   * “Edit Profile” modal for quick updates.
   * Saved listings tab and logout option.

---

### 🔒 **Renter Access Levels**

| Action                   | Unverified Renter  | Verified Renter |
| ------------------------ | ------------------ | --------------- |
| View property listings   | ✅ All              | ✅ All           |
| Message agents           | ⚠️ 3 messages/week | ✅ Unlimited     |
| Appear in agent matching | ❌                  | ✅               |
| View full agent contact  | ❌ Hidden           | ✅ Shown         |
| Save properties          | ✅                  | ✅               |
| Search ranking priority  | ❌                  | ✅ Higher        |

---

## 🧑🏾‍💼 **AGENT EXPERIENCE**

### 🎯 Goal:

List properties, manage conversations, and reach verified student renters.

### Main Pages / Sections

1. **📊 Agent Dashboard**

   * Overview cards showing:

     * Total listings
     * Active inquiries
     * Verified renters matched
   * Alerts: “Verify your account to unlock unlimited listings.”
   * Quick action buttons for:

     * Add New Listing
     * View Matched Renters
     * Manage Chats

2. **🏘️ My Listings Page**

   * Table/grid view of properties:

     * Thumbnail, Title, Location, Rent, and Status.
   * Inline edit options or “Edit Listing” modal.
   * “Add New Listing” button at top-right.
   * Sort & filter by location, visibility, or rent price.

3. **➕ Add Listing Page**

   * Multi-step form:

     * Step 1: Basic details (Title, Type, Price, Location)
     * Step 2: Upload photos (max 5)
     * Step 3: Amenities & description
   * Preview before submission.
   * If **verified**, listing appears instantly.
   * If **unverified**, listing requires admin check.

4. **👥 Matched Renters Page**

   * Table view of verified renters who fit the agent’s target criteria.
   * Each row: Name, School, Budget, Match Score %, and “Message” or “Unlock Contact.”
   * For unverified agents, this page is locked with prompt:

     > “Verify to access matched renters.”

5. **💬 Messages Page**

   * Split layout (like Gmail):

     * Left panel: list of ongoing chats.
     * Right panel: open chat.
   * Includes renter’s verification status on header.
   * Option to mark chats as “closed” after deal completion.

6. **👤 Profile & Verification**

   * Fields for agency name, address, and logo.
   * Upload CAC certificate or personal ID.
   * Shows verification badge once approved.
   * Toggle for “Available for student listings.”

---

### 🔒 **Agent Access Levels**

| Action                     | Unverified Agent | Verified Agent       |
| -------------------------- | ---------------- | -------------------- |
| Add property listings      | ✅ Up to 3        | ✅ Unlimited          |
| Listings visibility        | ⚠️ Lower ranked  | ✅ Featured           |
| View matched renters       | ❌                | ✅                    |
| Unlock renter contact info | ❌                | ✅                    |
| Message renters            | ✅                | ✅                    |
| Appear in search results   | ✅                | ✅ (higher placement) |

---

## 👨🏽‍💻 **ADMIN DASHBOARD (Web-Only)**

1. **Overview Dashboard**

   * Displays total users, verified users, pending verifications, and total listings.
   * Graphs for growth and engagement.

2. **User Management**

   * Filter by role (Renter / Agent).
   * Approve or reject verification requests.
   * View uploaded documents securely.

3. **Listings Management**

   * View, edit, or remove any listing.
   * Flag or approve pending ones.

4. **Reports & Analytics**

   * Active areas, universities with highest rental demand.
   * Agent performance and renter engagement.

---

## 🧩 **NAVIGATION STRUCTURE (Desktop Layout)**

### Renters

* **Top Navbar:** Search bar, Notifications, Profile dropdown.
* **Sidebar Tabs:** Explore, Messages, Saved, Verification, Profile.

### Agents

* **Left Sidebar:** Dashboard, Listings, Matches, Messages, Profile.
* **Top Navbar:** Quick actions (“+ Add Listing”), Notifications.

### Admin

* **Sidebar:** Overview, Users, Listings, Verification, Analytics.

---

## 🎨 **DESIGN & UX NOTES**

* **Layout:** Responsive grid, card-based UI, clean white background, blue accents.
* **Transitions:** Smooth fade + slide animations (Framer Motion).
* **Verification badges:**

  * 🟡 Pending
  * 🔵 Verified
  * ⚫ Unverified
* **Feedback & Alerts:**

  * Toast: “Listing added successfully.”
  * Banner: “Verification in review.”
  * Modal: “You’ve reached your chat limit.”

---

## ✅ **USER STATES SUMMARY**

| User Type | Verification States             | Effects                                                 |
| --------- | ------------------------------- | ------------------------------------------------------- |
| Renter    | Unverified → Pending → Verified | Determines visibility, chat limit, and access to agents |
| Agent     | Unverified → Pending → Verified | Determines listing limit, ranking, and lead access      |

---

## 💼 **Platform Goals by Role**

* **Renters:** Find safe, verified housing options and trusted agents.
* **Agents:** Showcase verified listings and connect with real student tenants.
* **Admin:** Maintain trust, data quality, and platform transparency.

FOR THE THEME, USE THE DEFAULTS IN GLOBAL.CSS, ALSO USE SHADCN FOR UI 