class Api::RecordsController < ApplicationController
  def create
    date = Date::strptime(params[:date], "%m/%d/%y")
    Record.find_or_create_by(day: date, enrollment_id: params[:id]) do |record|
      record.status = params[:status] 
      record.save
    end
  end
end
