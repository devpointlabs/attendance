class Api::ReportsController < ApplicationController
  def index
    render json: Report.order(created_at: :desc)
  end

  def show
    render json: Report.parse_data(params[:id])
  end

  def destroy
    Report.find(params[:id]).destroy
  end

  def user_in_course
    Report.delay.user_in_course(params[:course_id], params[:id])
  end
  
  def course_report
    Report.delay.course_report(params[:course_id])
  end
end
