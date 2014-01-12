# coding: utf-8
require 'sinatra/base'
require 'sinatra/json'
# require 'ostruct'
# require 'time'
require 'json'

# require 'pp'

BASE_FILE_PATH = './upload/home'


class MyWay < Sinatra::Base
  helpers Sinatra::JSON

  set :root, File.expand_path('../../', __FILE__)

  before do
    @pwd   = ''
    @files = []
  end

  get '/home/?' do
    @pwd = ''
    request.accept.each do |type|
      case type.to_s
      when 'text/html'
        halt erb(:index)
      when 'text/json', 'application/json'
        set_file_info(BASE_FILE_PATH, @pwd)
        halt json @files
      end
      error 406
    end
  end

  get '/home/*' do
    @pwd = params[:splat][0].gsub('..', '')

    if File.exists?("#{BASE_FILE_PATH}/#{@pwd}")
      if File.directory?("#{BASE_FILE_PATH}/#{@pwd}")
        # Directory
        request.accept.each do |type|
          case type.to_s
          when 'text/html'
            halt erb(:index)
          when 'text/json', 'application/json'
            set_file_info(BASE_FILE_PATH, @pwd)
            halt json @files
          end
          error 406
        end
      else
        # File
        view_static_file("#{BASE_FILE_PATH}/#{@pwd}")
      end
    else
      # 仮
      [404, "page not found"]
    end
  end

  get '/file/home/*' do
    @pwd = params[:splat][0].gsub('..', '')
    send_file("#{BASE_FILE_PATH}/#{@pwd}")
  end

  get '/upload' do
    erb :upload
  end

  post '/upload' do
    if params[:file]
      upload_path = "#{BASE_FILE_PATH}/#{params[:file][:filename]}"
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
    # p params#['dir_name']
    dir_name = params['dir_name']
    pwd      = params['pwd'].gsub('home/', BASE_FILE_PATH)

    # puts "#{pwd}#{dir_name}"
    Dir.mkdir("#{pwd}#{dir_name}")

    redirect pwd
  end

  get '/' do
    redirect '/home'
  end

  private
  def set_file_info(base_path, pwd)
    if pwd.empty?
      search_path = "#{base_path}/*"
    else
      search_path = "#{base_path}/#{pwd}/*"
    end
    Dir.glob(search_path) do |file|
      @files << {
        basename: File.basename(file),
        mime_type: mime_type(File.extname(file)) || "folder",
        modified: File.mtime(file).strftime("%Y/%m/%d %H:%M"),
        file_path: file.gsub("#{base_path}/", '/home/')
      }
    end
  end

  def view_static_file(file_path)
    file_name  = File.basename(file_path)
    mime_type  = mime_type(File.extname(file_path))
    uri        = file_path.gsub('./upload', '/file')
    parent_uri = File.dirname(file_path).gsub('./upload', '')
    halt erb "static_file".to_sym, :locals => { uri: uri, name: file_name, type: mime_type, parent_uri: parent_uri }
  end
end
