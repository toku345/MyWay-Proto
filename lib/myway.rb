require 'sinatra/base'
require 'ostruct'
require 'time'

class MyWay < Sinatra::Base
  set :root, File.expand_path('../../', __FILE__)

  get '/' do
    erb :index
  end
end
