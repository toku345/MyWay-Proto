# coding: utf-8
require 'sinatra/base'
# require 'ostruct'
require 'time'
require 'json'

# require 'pp'

class MyWay < Sinatra::Base
  set :root, File.expand_path('../../', __FILE__)

  before do
    @pwd   = ''
    @files = []
  end

  get '/home/?' do
    set_file_info('./upload')
    erb :index
  end

  get '/home/*' do
    @pwd   = params[:splat][0].gsub('..', '')
    if Dir.exists?("./upload/#{@pwd}")
      set_file_info("./upload/#{@pwd}")
      erb :index
    else
      # 仮
      [404, "page not found"]
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

  post '/create_dir' do
    p params#['dir_name']
    dir_name = params['dir_name']
    pwd      = params['pwd']

    # [200, "ok"]
  end

  get '/' do
    redirect '/home'
  end

  private
  def set_file_info(dir_path)
    Dir.glob("#{dir_path}/*") do |file|
      @files << {
        basename: File.basename(file),
        mime_type: mime_type(File.extname(file)),
        updated_at: File.mtime(file),
        file_path: file
      }
    end
  end
end
