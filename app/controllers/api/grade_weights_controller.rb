class Api::GradeWeightsController < ApplicationController
  def create
    weight_params = params.require(:weights).permit(:assignments, :attendance)
    weight = GradeWeight.find_or_create_by(course_id: params[:course_id])
    weight.update(weight_params)
  end

  def update
    # update standards
    weight = GradeWeight.find_or_create_by(course_id: params[:course_id])
    weight.standard = params[:standard]
    weight.save
  end
end
