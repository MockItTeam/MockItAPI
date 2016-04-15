class AdminController < ApplicationController
  before_action :check_admin_authorization

	def index
		@mockups = Mockup.order(id: :desc)
	end

  def check_admin_authorization
    allows = ["127.0.0.1", "10.0.2.2"]
    unless allows.include?(request.remote_ip)
      render html: "<h1>403</h1>IP Logged: #{request.remote_ip}".html_safe
    end
  end

end
