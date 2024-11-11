# Location Pinning App (Trackr)

## Overview

Trackr is a location pinning app built with **React Native**, **Redux**, and **Google Maps**. It lets users pin, manage, and view locations on the map. The app includes a sliding **Gorhom Bottom Sheet**, **Autocomplete** for searching locations, and **SVG** for custom markers. It’s all powered by **Redux** for state management, and the app uses **AsyncStorage** to persist data between sessions. I also used **GeoLib** to calculate distances between locations.

## Features
 
### Core Features

#### Map & Location Pins
- **Google Maps**: Full-screen map where users can tap to add location pins.
- **Custom Markers**: Used **SVG** for custom pin designs for a unique touch.
- **Reverse Geocoding**: Once a location is tapped, I reverse geocode coordinates using **Google Maps API** to fetch the address.
  
#### Bottom Sheet
- **Gorhom Bottom Sheet**: Sliding sheet that’s draggable and responsive with smooth animations, thanks to **React Native Reanimated**.
  - Sheet stays in sync with the map but doesn’t interfere with map interactions when collapsed.
  - Right-to-left swipe gesturs to delete a location, tap a button to delete all.

#### Location Management
- **Add Locations**: Tap on the map, and a modal will display so users can customize the location. After saving, a pin appears with the address from geocoding.
- **Edit Locations**: Drag a pin to a new position to update it.
- **Delete Locations**: Swipe to delete locations from the list in the bottom sheet.
  
#### Location List
- **FlatList** in the bottom sheet for displaying location details:
  - Name, address, and distance from the current location (using **GeoLib** for distance calc).

#### Autocomplete
- **Search Locations**: Integrated a react native package for location search with autocomplete. Users can search for places and jump to that location on the map.

### Bonus Features
- **Marker Clustering**: If you have lots of pins, they’ll cluster together for a cleaner map.
- **Current Location**: Shows the user’s current location on the map.
- **Distance Calculation**: Calculating distances between pinned locations using **GeoLib**.
- **Redux for State Management**: All app state (locations) are managed by Redux.
- **AsyncStorage**: Store locations locally, so the data persists between app restarts.

## Technical Setup

### Prerequisites

- **Node.js** (version `18.20.4` or later)
- **React Native CLI** with the new architecture enabled (Hermes, Fabric, etc.)
- **Google Maps API Key** (set it up in `.env`)

### Installation

1. Clone the repo and cd to the project directory

2. Install dependencies:
   ```bash
   npm install
   npm run pod
   ```

3. Add your **Google Maps API Key** to the `.env` file:
   ```plaintext
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

### Running the App

1. Start the development server:
   ```bash
   npm run start  # or
   npm run clean
   ```

2. Run the app:
   - For iOS:
     ```bash
     npm run ios # or i
     ```
   - For Android:
     ```bash
     np run android  # or a
     ```

### Key Features in Code

- **Redux** is used to handle app state. This keeps things organized when managing locations, and syncing across different components.
  
- **AsyncStorage** is used to persist pinned locations even when the app is closed and reopened. This keeps the user’s data safe.

- **GeoLib** handles distance calculations for location-based features, like showing how far a location is from the user’s current location.

- **Gorhom Bottom Sheet** handles the sliding interaction for the location list. It has a clean, fluid user experience and is fully customizable.

- **Autocomplete** (with **react-native-google-places-autocomplete**) is used for searching locations, making it faster and easier to find a spot on the map.

## Known Issues

- **Marker Clustering** could be improved for more performance-heavy maps, especially with a lot of locations.
- **Bottom Sheet Performance**: On some devices, when the sheet is dragged with a large list, there’s a slight lag.
  
## Additional Notes
  
- **Custom SVG Markers**: Used for adding a more personalized and visually appealing design for the map pins.


