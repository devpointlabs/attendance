class Course < ApplicationRecord
  has_many :enrollments, dependent: :destroy
  has_many :courses, through: :enrollments

  def self.init_course(id)
    counts = { users: 0, enrollments: 0, errors: [], status: 200, name: '' }
    begin
      HTTParty::Basement.default_options.update(verify: false)
      url = "#{ENV['CANVAS_BASE_URL']}/courses/#{id}"
      auth = {"Authorization" => "Bearer #{ENV['CANVAS_API_KEY']}"}
      Course.find_or_create_by(canvas_id: id) do |course|
        canvas_course = HTTParty.get(url, headers: auth)
        course.name = canvas_course['name']
        counts[:name] = course.name
        course.save
        users_url = "#{ENV['CANVAS_BASE_URL']}/courses/#{id}/users?per_page=100"
        users = HTTParty.get(users_url, headers: auth, query: { include: ['avatar_url', 'enrollments'] })
        users.each do |u|
          User.find_or_create_by(email: u['login_id']) do |user|
            if user.new_record?
              counts[:users] += 1
              user.password = SecureRandom.hex
            end
            user.image = u['avatar_url']
            user.name = u['name']
            user.save!
            enrollment = u['enrollments'].find { |e| e['course_id'] == id }
            role = enrollment['role'].downcase.gsub('enrollment', '')
            Enrollment.find_or_create_by(role: role, user_id: user.id, course_id: course.id) do |en|
              counts[:enrollments] += 1 if en.new_record?
            end
          end
        end
      end
        counts
    rescue => e
      counts[:errors] << e
      counts[:status] = 422
    end
  end

end
