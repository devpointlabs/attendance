class Api::RecordsController < ApplicationController
  def create
    date = Date::strptime(params[:date], "%m/%d/%Y")
    Record.find_or_create_by(day: date, enrollment_id: params[:id]) do |record|
      record.status = params[:status] 
      record.save
      render json: record
    end
  end

  def date
    records = Record.by_course(params[:course_id], params[:date])
    render json: records
  end
end
