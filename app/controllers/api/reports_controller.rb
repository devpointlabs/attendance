class Api::ReportsController < ApplicationController
  def user_in_course
    Report.user_in_course(params[:course_id], params[:id])
  end
end
