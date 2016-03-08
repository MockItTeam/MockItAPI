workers Integer(ENV['PUMA_WORKERS'] || 3)
threads Integer(ENV['MIN_THREADS'] || 1), Integer(ENV['MAX_THREADS'] || 16)

preload_app!

rackup DefaultRackup
environment ENV['RACK_ENV'] || 'development'
port        ENV['PORT']     || 3000

stdout_redirect '/var/www/mockitAPI/shared/log/stdout', '/var/www/mockitAPI/shared/log/stderr'

on_worker_boot do
  # worker specific setup
  ActiveSupport.on_load(:active_record) do
    config = ActiveRecord::Base.configurations[Rails.env] ||
      Rails.application.config.database_configuration[Rails.env]
    config['pool'] = ENV['MAX_THREADS'] || 16
    ActiveRecord::Base.establish_connection(config)
  end
end
