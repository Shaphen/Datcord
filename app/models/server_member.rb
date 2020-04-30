class ServerMember < ApplicationRecord
  
  belongs_to :member,
    foreign_key: :member_id,
    class_name: :User

  belongs_to :server,
    foreign_key: :server_id,
    class_name: :Server

end
