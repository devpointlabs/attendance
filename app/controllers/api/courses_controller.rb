class Api::CoursesController < ApplicationController
  def init
    id = params[:id].to_i
    data = Course.init_course(id)
    render json: data
  end
end
