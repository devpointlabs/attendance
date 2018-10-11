class Event < ApplicationRecord
  validates_presence_of :name, :label, :event_date
  before_save :check_all_day
  before_update :check_all_day

  def check_all_day
    if self.allDay
      self.event_start = self.event_date.beginning_of_day.time
      self.event_end = self.event_date.end_of_day.time
    end
  end
end
