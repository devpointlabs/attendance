class Api::RecordsController < ApplicationController
  def create
    date = Date::strptime(params[:date], "%m/%d/%Y")
    r = Record.find_or_create_by(day: date, enrollment_id: params[:id])
    status = r.status == params[:status] ? '' : params[:status]
    r.update(status: status)

    render json: r.reload
  end

  def date
    records = Record.by_course(params[:course_id], params[:date])
    render json: records
  end

  def individual
    enrollment = Course.find(params[:course_id]).enrollments.find(params[:id])
    user = enrollment.user
    records = enrollment.records.order(day: :desc)
    render json: { 
      name: user.name, 
      image: user.image, 
      records: records
    }
  end
end
