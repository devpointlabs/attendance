class Api::RecordsController < ApplicationController
  def create
    date = Date::strptime(params[:date], "%m/%d/%Y")
    r = Record.find_or_create_by(day: date, enrollment_id: params[:id])
    r.update(status: params[:status])

    render json: r.reload
  end

  def date
    records = Record.by_course(params[:course_id], params[:date])
    render json: records
  end

  def individual
    enrollment = Course.find(params[:course_id]).enrollments.find(params[:id])
    user = enrollment.user
    records = enrollment.records
    present = records.where(status: 'present').length rescue 0 
    absent = records.where(status: 'absent').length rescue 0
    tardy = records.where(status: 'tardy').length rescue 0
    excused = records.where(status: 'excused').length rescue 0
    render json: { 
      name: user.name, 
      image: user.image, 
      present: present, 
      absent: absent, 
      excused: excused, 
      tardy: tardy
    }
  end
end
