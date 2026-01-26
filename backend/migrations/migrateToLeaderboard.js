import mongoose from 'mongoose';
import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Migration Script: Move scores from User model to separate Leaderboard collection
 * Run this ONCE to migrate existing users without breaking them
 */

async function migrateToLeaderboard() {
           try {
                      console.log('🔄 Starting migration to Leaderboard collection...\n');

                      // Connect to MongoDB
                      await mongoose.connect(process.env.MONGODB_URI);
                      console.log('✅ Connected to MongoDB\n');

                      // Get all users
                      const users = await User.find();
                      console.log(`📊 Found ${users.length} users to migrate\n`);

                      let migrated = 0;
                      let skipped = 0;
                      let errors = 0;

                      for (const user of users) {
                                 try {
                                            // Check if leaderboard entry already exists
                                            const existing = await Leaderboard.findOne({ userId: user._id });

                                            if (existing) {
                                                       console.log(`⏭️  Skipped: ${user.username} (already has leaderboard entry)`);
                                                       skipped++;
                                                       continue;
                                            }

                                            // Create leaderboard entry
                                            await Leaderboard.create({
                                                       userId: user._id,
                                                       username: user.username,
                                                       totalScore: user.totalScore || 0,
                                                       solvedChallenges: user.solvedChallenges || [],
                                                       lastUpdated: new Date()
                                            });

                                            console.log(`✅ Migrated: ${user.username} - ${user.totalScore || 0} points, ${user.solvedChallenges?.length || 0} challenges`);
                                            migrated++;

                                 } catch (err) {
                                            console.error(`❌ Error migrating ${user.username}:`, err.message);
                                            errors++;
                                 }
                      }

                      console.log('\n📊 Migration Summary:');
                      console.log(`   ✅ Migrated: ${migrated}`);
                      console.log(`   ⏭️  Skipped:  ${skipped}`);
                      console.log(`   ❌ Errors:   ${errors}`);
                      console.log(`   📊 Total:    ${users.length}\n`);

                      console.log('✅ Migration completed successfully!');
                      console.log('ℹ️  User authentication data remains untouched in users collection');
                      console.log('ℹ️  Leaderboard data is now in leaderboards collection\n');

           } catch (error) {
                      console.error('❌ Migration failed:', error);
           } finally {
                      await mongoose.connection.close();
                      console.log('🔌 Disconnected from MongoDB');
           }
}

// Run migration
migrateToLeaderboard();
