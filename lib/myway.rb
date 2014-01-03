# coding: utf-8
require 'sinatra/base'
require 'ostruct'
require 'time'

class MyWay < Sinatra::Base
  set :root, File.expand_path('../../', __FILE__)

  ['/home', '/home/*'].each do |route|
    get route do
      p params[:splat]
      
      @files = [
        {
          name: 'sample.jpg',
          updated: Date.parse('2014/01/01 12:00'),
          file_type: 'jpg',
          file_url: '/'
        }
      ]

      files = Dir.glob('./upload/*') do |file|
        # p file
      end

      erb :index
    end
  end

  get '/upload' do
    erb :upload
  end

  post '/upload' do
    if params[:file]
      upload_path = "./upload/#{params[:file][:filename]}"
      File.open(upload_path, "wb") do |f|
        f.write params[:file][:tempfile].read
        @result = "アップロード成功"
      end
    else
      @result = "アップロード失敗"
    end

    erb :upload
  end

  get '/' do
    redirect '/home'
  end
end
