require 'csv'

class Report < ApplicationRecord
  def self.user_in_course(course_id, user_id)
    enrollment = Enrollment.find_by(course_id: course_id, user_id: user_id)
    course = enrollment.course
    user = enrollment.user
    records = enrollment.records.order(day: :desc)
    name = "#{user.name.downcase.gsub(' ', '_')}"
    file = CSV.generate do |csv|
      csv << ['date', 'status']
      records.each { |record| csv << [record.day.strftime('%m/%d/%Y'), record.status] }
    end
    s3 = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
    s3_bucket = ENV['S3_BUCKET']
    begin
      obj = s3.bucket(s3_bucket).object("reports/courses/#{course.id}/#{name}-#{DateTime.now.to_s}.csv")
      obj.put body: file
      Report.create(report_type: 'student', url: obj.key)
    rescue => e
      Rails.logger.error("ERROR: #{e}")
    end
  end
end

