const JobModel = require('../models/jobModel');
const UserModel = require('../models/userModel');

class AnalyticsService {
  static async getDashboardStats() {
    try {
      // Get total students count
      const totalStudents = await UserModel.countDocuments({ role: 'student' });

      // Get placed students count
      const placedStudents = await UserModel.countDocuments({
        role: 'student',
        isPlaced: true
      });

      // Calculate average package
      const placedStudentsData = await UserModel.find(
        { role: 'student', isPlaced: true },
        'packageOffered'
      );
      const totalPackage = placedStudentsData.reduce(
        (sum, student) => sum + (student.packageOffered || 0),
        0
      );
      const averagePackage = placedStudentsData.length
        ? totalPackage / placedStudentsData.length
        : 0;

      // Get ongoing drives count
      const ongoingDrives = await JobModel.countDocuments({
        status: 'active'
      });

      // Get monthly placement data
      const monthlyPlacements = await UserModel.aggregate([
        {
          $match: {
            role: 'student',
            isPlaced: true,
            placementDate: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$placementDate' },
              year: { $year: '$placementDate' }
            },
            placements: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            month: '$_id.month',
            year: '$_id.year',
            placements: 1
          }
        },
        { $sort: { year: 1, month: 1 } }
      ]);

      return {
        totalStudents,
        placedStudents,
        averagePackage,
        ongoingDrives,
        placementData: monthlyPlacements.map(data => ({
          month: new Date(2024, data.month - 1).toLocaleString('default', {
            month: 'short'
          }),
          placements: data.placements
        }))
      };
    } catch (error) {
      console.error('Error in analytics service:', error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;