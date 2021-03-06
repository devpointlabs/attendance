class Api::RecordsController < ApplicationController
  def create
    date = Date::strptime(params[:date], "%m/%d/%Y")
    r = Record.find_or_create_by(day: date, enrollment_id: params[:id])
    status = r.status == params[:status] ? '' : params[:status]
    r.update(status: status)

    render json: r.reload
  end

  def upload
    data = CSV.parse(params[:file].tempfile, headers: true, header_converters: :symbol )
    required_headers = [:id, :date, :status, :course]
    if (required_headers - data.headers).empty?
      Record.delay.upload(data)
    else
      render json: 'Missing Headers', status: 422
    end
  end

  def all_present
    course = Course.find(params[:course_id])
    date = Date::strptime(params[:date], "%m/%d/%Y")
    enrollments = course.enrollments.where(role: 'student')
    records = []
    enrollments.each do |e|
      record = Record.find_or_create_by(day: date, enrollment_id: e.id)
      record.status = 'present'
      record.save
      records << { id: e.id, status: 'present' }
    end

    render json: records
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
      id: user.id,
      name: user.name, 
      image: user.image, 
      records: records
    }
  end
end
