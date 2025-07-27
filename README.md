# Daily Check-in App - Backend Schema & Structure

## Overview
A lean MVP backend for a daily check-in app focused on AdMob revenue generation. Users earn points through daily check-ins and can redeem them for rewards.

## Key Features
- **Daily Check-ins**: Users check in daily to earn points and maintain streaks
- **Points System**: Comprehensive points tracking with transactions
- **Streak Bonuses**: Reward users for consecutive check-ins
- **Rewards Catalog**: Future gift redemption system
- **AdMob Integration**: Track ad interactions and revenue
- **Analytics**: Monitor user engagement and revenue metrics

## Database Schema

### Core Tables
1. **users** - User profiles and stats
2. **daily_checkins** - Daily check-in records
3. **points_transactions** - Detailed points tracking
4. **rewards** - Available rewards/gifts
5. **user_redemptions** - Reward redemption history
6. **ad_interactions** - AdMob interaction tracking
7. **app_config** - Dynamic app configuration
8. **streak_bonuses** - Streak milestone rewards

## API Endpoints

### Check-in System
- `POST /api/checkin` - Perform daily check-in
- `GET /api/checkin?userId=xxx` - Get check-in status

### Ad Integration
- `POST /api/ads` - Record ad interactions (impression, click, completion)

### Rewards System
- `GET /api/rewards` - Get available rewards
- `POST /api/rewards` - Redeem reward

## Business Logic

### Points System
- Base points: 10 per check-in
- Streak bonuses: 7 days (+20), 30 days (+100), etc.
- Weekend bonus: +5 points
- Ad rewards: +5 points per rewarded ad

### Revenue Strategy
- Interstitial ads between app sections
- Banner ads on main screens
- Rewarded video ads for bonus points
- Premium features (ad-free periods)

## MVP Implementation Priority

### Phase 1 (Core MVP)
1. User registration/authentication
2. Daily check-in functionality
3. Basic points system
4. AdMob integration
5. Simple rewards catalog

### Phase 2 (Growth)
1. Social features (leaderboards)
2. Push notifications for check-in reminders
3. Advanced streak bonuses
4. More reward types

### Phase 3 (Monetization)
1. Premium subscriptions
2. Sponsored rewards
3. Advanced analytics dashboard
4. A/B testing framework

## Technical Stack Recommendations

### Backend
- **Database**: PostgreSQL (Neon for serverless)
- **API**: Next.js API routes
- **Authentication**: Supabase Auth or NextAuth
- **Hosting**: Vercel

### Mobile App
- **Framework**: React Native or Flutter
- **State Management**: Redux Toolkit or Zustand
- **AdMob**: Google AdMob SDK
- **Push Notifications**: Firebase Cloud Messaging

## Environment Variables Required
\`\`\`
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=your_app_url
\`\`\`

## Getting Started
1. Set up Neon database
2. Run the SQL scripts in order (001, 002, 003)
3. Configure environment variables
4. Deploy to Vercel
5. Integrate with mobile app

## Analytics & Monitoring
- Daily Active Users (DAU)
- Check-in completion rates
- Ad revenue per user
- Streak distribution
- Reward redemption rates
