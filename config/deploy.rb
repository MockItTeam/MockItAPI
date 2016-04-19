require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/rvm'    # for rvm support. (http://rvm.io)
require 'mina/puma'
# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

ENV['branch'] ||= 'master'

set :user, 'root'
set :domain, 'mockit.co'
set :deploy_to, '/var/www/mockitAPI'
set :repository, 'https://github.com/MockItTeam/MockItAPI.git'
set :branch, ENV['branch']

# For system-wide RVM install.
set :rvm_path, '/usr/local/rvm/bin/rvm'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.

# Optional settings:
#   set :user, 'foobar'    # Username in the server to SSH to.
#   set :port, '30000'     # SSH port number.
#   set :forward_agent, true     # SSH forward_agent.

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  invoke :'rvm:use[ruby-2.3.0]'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]

  queue! %[touch "#{deploy_to}/shared/config/database.yml"]
  queue! %[touch "#{deploy_to}/shared/config/secrets.yml"]
  queue  %[echo "-----> Be sure to edit '#{deploy_to}/shared/config/database.yml' and 'secrets.yml'."]

  # Puma needs a place to store its pid file and socket file.
  queue! %(mkdir -p "#{deploy_to}/shared/tmp/sockets")
  queue! %(chmod g+rx,u+rwx "#{deploy_to}/shared/tmp/sockets")
  queue! %(mkdir -p "#{deploy_to}/shared/tmp/pids")
  queue! %(chmod g+rx,u+rwx "#{deploy_to}/shared/tmp/pids")

end

set :shared_paths, ['config/database.yml', 'tmp/pids', 'tmp/sockets']

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    set :bundle_bin, '/usr/local/rvm/gems/ruby-2.3.0/bin/bundle'
    set :bundle_path, './vendor/bundle'
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'run[cd /var/www/mockitAPI/current/frontend && /root/.nvm/versions/node/v5.10.1/bin/npm install && /root/.nvm/versions/node/v5.10.1/bin/bower install --allow-root]'
    invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'

    to :launch do
      invoke :'run[kill -9 $(lsof -i tcp:3000 -t)]'
      invoke :'run[kill -9 $(lsof -i tcp:7000 -t)]'
      invoke :'puma:restart'
      invoke :'run[cd /var/www/mockitAPI/current/websocket && screen node server.js]'
      invoke :'run[cd /var/www/mockitAPI/current/ && screen bundle exec rake jobs:work]'
    end
  end
end

# For help in making your deploy script, see the Mina documentation:
#
#  - http://nadarei.co/mina
#  - http://nadarei.co/mina/tasks
#  - http://nadarei.co/mina/settings
#  - http://nadarei.co/mina/helpers
