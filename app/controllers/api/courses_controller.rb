class Api::CoursesController < ApplicationController
  def index
    if current_user.is_admin
      if params[:type] === 'archived'
        render json: Course.only_deleted.order(canvas_id: :desc)
      else
        render json: Course.order(canvas_id: :desc), include: :grade_weight
      end
    else
      render json: Course.with_enrollment(current_user.id)
    end
  end

  def show 
    users = Course.with_enrollments(params[:id])
    user = users.find { |u| u.user_id === current_user.id }
    if current_user.is_admin || user
      usrObj = current_user.is_admin ? current_user : user
      enrollments = users.select { |u| u.role == 'student' }
      render json: { users: enrollments, user: usrObj }
    else
      render json: 'restricted', status: 422
    end
  end

  def edit
    course = Course.find(params[:id])
    params[:course][:date] = params[:course][:date].to_date if params[:course][:date]
    if course.update(course_params)
      render json: course
    else
      render_error(course)
    end
  end

  def update
    # Restore from deleted_at
    course = Course.with_deleted.find(params[:id])
    course.update(deleted_at: nil)
    course.enrollments.with_deleted.each do|e| 
      e.update(deleted_at: nil) 
      e.records.with_deleted.each { |r| r.update(deleted_at: nil) }
    end
  end

  def destroy
    Course.find(params[:id]).destroy
  end

  def init
    id = params[:id].to_i
    data = Course.init_course(id)
    course_data = data[:course]
    grade_weight = { grade_weight: course_data.grade_weight.attributes }
    course = course = course_data.attributes.merge(grade_weight)
    render json: { counts: data[:counts], course: course }
  end

  def grades
    enrollment = Enrollment.find(params[:user_id])
    course = enrollment.course
    render json: { weights: course.grade_weight, grades: Course.grades(params[:course_id], enrollment) }
  end

  private
    def course_params
      params.require(:course).permit(:name, :course_start, :weeks)
    end
end
