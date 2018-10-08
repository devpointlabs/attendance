FactoryBot.define do
  factory :progress do
    week_start { "2018-10-08" }
    week_end { "2018-10-08" }
    assignments { 1.5 }
    attendance { 1.5 }
    total { 1.5 }
    grade { "MyString" }
    enrollment { nil }
  end
end
