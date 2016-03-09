if Rails.env.test?
  CarrierWave.configure do |config|
    config.storage = :file
    config.enable_processing = false
  end

  Dir["#{Rails.root}/app/uploaders/*.rb"].each { |file| require file }

  if defined?(CarrierWave)
    CarrierWave::Uploader::Base.descendants.each do |klass|
      next if klass.anonymous?
      klass.class_eval do
        def cache_dir
          "#{Rails.root}/spec/support/uploads/tmp"
        end

        def store_dir
          "#{Rails.root}/spec/support/uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
        end
      end
    end
  end
else
  CarrierWave.configure do |config|
    config.storage = :aws
    config.aws_bucket = ENV.fetch('S3_BUCKET_NAME')
    config.aws_acl = 'public-read'

    config.aws_credentials = {
      access_key_id: ENV.fetch('S3_AWS_ACCESS_KEY'),
      secret_access_key: ENV.fetch('S3_SECRET_ACCESS_KEY'),
      region: ENV.fetch('S3_REGION')
    }
    config.cache_dir = "#{Rails.root}/tmp/uploads"
  end
end