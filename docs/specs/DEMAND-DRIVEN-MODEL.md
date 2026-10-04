# Drumstr Demand-Driven Event Model (Real-Time)

## Overview
The Drumstr event model is a "Demand-Driven" marketplace. Instead of a facilitator posting a session and hoping for participants, the participants initiate the demand through real-time rhythmic signaling.

## The "Drum up a Circle" Mechanism

### 1. The Drum Call (Signal)
- **Action**: A member "drums" in real-time via the Drumstr app (tapping on phone/device).
- **Cost**: This active signaling costs **Zaps** (Bitcoin Lightning).
- **Propagation**: The "drum call" is broadcast on the Nostr network. Other members "hear" the call via real-time notifications.

### 2. The Response (Aggregation)
- **Joining**: Other members hear the call and respond by joining the signal.
- **Investment**: Participants may also spend Zaps to amplify the call or signal their commitment.
- **Volume**: The system tracks the cumulative "volume" of the call.

### 3. The Threshold (Trigger)
A session is triggered when **both** quotas are met:
- **House Minimum**: The global minimum required to make a session viable for a facilitator.
- **Personal Minimum**: The specific threshold required by the potential facilitator.

### 4. Facilitator Dispatch
- **Request**: Once the threshold is reached, a **Facilitator Request** is automatically dispatched to available, trained leaders.
- **Fulfillment**: 
  - If a facilitator accepts: The session starts immediately or at the nearest scheduled window.
  - If not fulfilled immediately: A delayed announcement is published with the confirmed start time.

### 5. Incentive Structure
- **Facilitators**: Are incentivized by the guaranteed "volume" of participants and the Zaps already committed during the "Drum up" phase.
- **Members**: Experience the thrill of collectively "summoning" a professional facilitator through rhythmic action.

---

## MVP Phase: The Daily Teaser
To build the member base and test the infrastructure, we launch with the **Daily 10-minute Drum Block**.
- **Purpose**: Commit minimally, build the habit, and seed the network.
- **Model**: Fixed schedule, free to join, voluntary compensation.
- **Goal**: Transition from the fixed schedule to the real-time Demand-Driven model as the network density increases.
