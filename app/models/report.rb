require 'csv'
require 'open-uri'

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
      Report.create(report_type: 'student', url: obj.key, name: name)
    rescue => e
      Rails.logger.error("ERROR: #{e}")
    end
  end

  def self.course_report(id)
    #TODO
    #Get coures
    #Get Enrollents
    #GET counts
    #Create CSV
    #Push to S3
    #create Report recoord
  end

  def self.parse_data(id)
    report = Report.find(id)
    s3 = Aws::S3::Presigner.new(region: ENV['AWS_REGION'])
    bucket = ENV['S3_BUCKET']
    url = s3.presigned_url(
      :get_object,
      bucket: bucket,
      key: report.url,
      expires_in: 2000
    )

    data = open(url).read
    lines = data.split("\n")
    head = lines[0].split(',')
    tail = lines.from(1).map { |l| l.split(',') }
    additional = {}

    if report.report_type === 'student'
      present = tail.select { |t| t.include? 'present' }.length
      absent = tail.select { |t| t.include? 'absent' }.length
      tardy = tail.select { |t| t.include? 'tardy' }.length
      excused = tail.select { |t| t.include? 'excused' }.length
      additional = { present: present, absent: absent, tardy: tardy, excused: excused }
    end

    {
      meta: { name: report.name, type: report.report_type, additional: additional },
      headers: head,
      data: tail
    }
  end
end

