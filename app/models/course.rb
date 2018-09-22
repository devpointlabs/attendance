class Course < ApplicationRecord
  acts_as_paranoid

  has_many :enrollments, dependent: :destroy
  has_many :users, through: :enrollments
  has_many :records

  def self.with_enrollments(course_id)
    select('e.id, u.name, u.image, e.role, e.user_id')
    .joins('INNER JOIN enrollments e ON e.course_id = courses.id')
    .joins('INNER JOIN users u on u.id = e.user_id')
    .where("courses.id = #{course_id}")
    .order('u.name')
  end

  def self.with_enrollment(user_id)
    select('DISTINCT(courses.id), courses.name, e.role, courses.canvas_id')
    .joins("INNER JOIN enrollments e ON e.course_id = courses.id 
            AND e.user_id = #{user_id}")
    .order('courses.canvas_id DESC')
  end

  def self.init_course(id)
    counts = { users: 0, enrollments: 0, errors: [], status: 200, name: '' }
    begin
      HTTParty::Basement.default_options.update(verify: false)
      url = "#{ENV['CANVAS_BASE_URL']}/courses/#{id}"
      auth = {"Authorization" => "Bearer #{ENV['CANVAS_API_KEY']}"}
      course = Course.find_or_create_by(canvas_id: id)
      canvas_course = HTTParty.get(url, headers: auth)
      course.name = canvas_course['name']
      counts[:name] = course.name
      course.save
      users_url = "#{ENV['CANVAS_BASE_URL']}/courses/#{id}/users?per_page=100"
      users = HTTParty.get(users_url, headers: auth, query: { include: ['avatar_url', 'enrollments'] })
      users.each do |u|
        binding.pry if u['login_id'] == 'dave@devpointlabs.com'
        user = User.find_or_create_by(email: u['login_id'])
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
      counts
    rescue => e
      counts[:errors] << e
      counts[:status] = 422
    end
  end

end
