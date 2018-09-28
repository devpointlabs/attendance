class Course < ApplicationRecord
  DEFAULT_ATTENDANCE = 75
  DEFAULT_ASSIGNMENT = 25
  DEFAULT_STANDARD = [
    { value: 90, key: 'S', text: 'Satisfactory' },
    { value: 80, key: 'I', text: 'Incomplete' },
    { value: 0, key: 'U', text: 'Unsatisfactory' }
  ]

  acts_as_paranoid
  after_create :create_weights

  has_many :enrollments, dependent: :destroy
  has_many :users, through: :enrollments
  has_many :records, dependent: :destroy
  has_one :grade_weight, dependent: :destroy

  def create_weights
    self.create_grade_weight(
      attendance: DEFAULT_ATTENDANCE, 
      assignments: DEFAULT_ASSIGNMENT,
      standard: DEFAULT_STANDARD
    )
    self.save
  end

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

  def self.grades(course_id, enrollment)
    auth = {"Authorization" => "Bearer #{ENV['CANVAS_API_KEY']}"}
    HTTParty::Basement.default_options.update(verify: false)
    #GET /api/v1/courses/:course_id/assignment_groups
    url = "#{ENV['CANVAS_BASE_URL']}/courses/#{enrollment.course.canvas_id}/assignment_groups"
    groups = HTTParty.get(url, headers: auth )
    group_id = groups.find { |g| g['name'] == 'Assignments' }['id']
    group = HTTParty.get(
      "#{url}/#{group_id}", 
      headers: auth, 
      query: {
        include: ['assignments', 'submissions'],
      }
    )
    assignments = group['assignments'].select { |a| a['published'] == true }
      .map { |a| { id: a['id'], points: a['points_possible'] } }

    sub_url = "#{ENV['CANVAS_BASE_URL']}/courses/#{enrollment.course.canvas_id}/students/submissions"
    submissions = HTTParty.get(
      sub_url,
      headers: auth,
      query: {
        student_ids: [enrollment.canvas_enrollment_id],
        grouped: true,
        assignment_ids: assignments.map { |a| a[:id] }
      }
    ).first['submissions'].map { |s| { assignment_id: s['assignment_id'], score: s['score'] } }

    data = assignments.map do |a|
      sub = submissions.find { |s| s[:assignment_id] == a[:id] } || { score: 0 }
      { 
        id: a[:id],
        points: a[:points],
        score: sub[:score]
      }
    end
    data
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
        canvas_enrollment_id = u['id']
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
        Enrollment.find_or_create_by(role: role, user_id: user.id, course_id: course.id, canvas_enrollment_id: canvas_enrollment_id) do |en|
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
