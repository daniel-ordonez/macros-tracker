# Macros Tracker

#### Try it here

[macros-tracker.netlify.app](https://macros-tracker.netlify.app/)

#### Video Demo: https://youtu.be/YyagaKD63No

---

## Description:

Note: This description is written in English, as is most of the code in this project. However, the app’s interface is in Spanish. I am from Guatemala, and I built this app primarily for my local friends.

This web app helps you track the macronutrients (macros) in the foods you eat. The tracked macros are:
• Calories
• Protein
• Carbohydrates
• Fats

The app is currently in its MVP (Minimum Viable Product) stage, meaning some features are limited, missing, or planned for future iterations as the project grows and improves.

---

# App Flow and Structure

## Technical Details

This project was built using SvelteKit. User-provided data is stored locally in the browser using the localStorage and IndexedDB APIs.

⚠️ Important: If you clear your browser data, all stored information will be lost. Future iterations may include cloud backup support, but for now, all data is stored locally.

---

## User Flow

1. Start Page

The first time you access the app, you’ll be prompted to provide some basic information:
• Your name: Used to personalize your profile.
• Your age, height, weight, sex, and activity level: Used to calculate your daily caloric needs.
• Your goal: Choose between maintaining weight, losing weight, or gaining weight (ideally through muscle building and exercise).

Based on this input, the app calculates a calorie budget and target macros to help you achieve your goal.

After submitting this information, you’ll be redirected to the Dashboard.

---

2. Dashboard

The Dashboard is divided into four panels: 1. Food Log: Manage and log your meals. 2. Charts: Visualize your progress toward your target macros.

The layout adapts to the viewport size:
• Mobile devices: Displays as a single column. Charts appear first (row 1), while the Food Log can be accessed by scrolling horizontally (row 2).
• Larger screens: Displays the Food Log panel on the left and the Charts panel on the right.

---

### Food Log

Initially, the Food Log shows:
• The heading “Diario de comida”.
• A date input (pre-filled with the current date).
• A large button labeled “Registrar comida +”.

Clicking “Registrar comida +” opens a modal with the Register Food form.

---

#### Register Food

If you haven’t added any foods yet, a button labeled “Nuevo alimento” will appear. Clicking it opens the New Food Form.

Once you’ve registered one or more foods, you can select one to open the Log Food Form, where you can log your meals.

---

#### New Food Form

Use this form to input the nutritional information of a new food you’d like to track. After submitting the form, the food is added to your database.

If you don’t have nutritional data for a food, there’s a blue button with a globe icon. Clicking it opens a dropdown menu (⚠️ Known Bug: This may not work on mobile devices).

The dropdown offers links to three external websites where you can search for nutritional data.

⚠️ Note: Only the first option, FatSecret, is in Spanish. The other two options are in English.

To use this feature: 1. Open the external site and search for the food. 2. Copy the URL of the food’s page. 3. Paste the URL into the “Nombre” field of the form.

This will automatically scrape the data and populate the form fields.

⚠️ Caution: This feature relies on client-side web scraping, which may not always work.

---

#### Log Food Form

This form displays the macros for the selected serving size of a food item. You can:
• Adjust the number of servings and serving size.
• Set the date and time of the meal.

Click “Registrar” to log the meal.

---

### Charts

#### Bars

This panel displays bar charts that compare your macros (protein, carbs, and fat) for the current date against your target values. It also shows the total number of calories consumed for the day.

---

#### Calendar

A monthly calendar that lets you navigate through months and quickly change the current date to explore your logs. The calendar uses different shades of blue to indicate how closely your daily calorie intake matches your target.

---

#### Stacked Bars

This chart shows how your calorie intake for each day of the current week compares to your target calories. The bars are stacked with different colors to represent the contribution of protein, carbs, and fat to the total calories for each day.
