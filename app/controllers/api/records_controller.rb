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
    #TODO 
    #Find Course
    #Find Enrollment By Id
    #Find Records
    #create object for Present / Absent / Tardy / Excused
  end
end
