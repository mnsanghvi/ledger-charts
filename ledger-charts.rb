# -*- coding: utf-8 -*-
require 'rubygems'
require 'json'
require 'haml'

require 'sinatra/base'

class LedgerCharts < Sinatra::Base
  VERSION = "0.0"
  REPORTS_DIR = "data/reports" # HC

  LEDGER_REST_URI = "http://127.0.0.1:9292/rest" # HC

  set :ledger_rest_uri, LEDGER_REST_URI

  configure do |c|
    @@reports = {}
    @@next_id = 0
    @@last_active = nil

    Dir[REPORTS_DIR+"/*.json"].each do |file|
      id = File.basename(file).to_i
      report = JSON.parse(IO.read(file), :symbolize_names => true)
      
      report[:active] = false
      
      @@reports[id] = report
      
      @@next_id = id if (id > @@next_id)
    end

    @@next_id += 1
  end

  before do
    @@reports[@@last_active][:active] = false unless @@last_active.nil?
  end

  get '/' do
    @reports = @@reports
    @report_name = "Index"
    @@last_active = nil

    haml :index
  end

  get '/report/:id' do
    id = params[:id].to_i

    @@last_active = id
    @reports = @@reports

    @reports[id][:active] = true
    @chart_options = @reports[id]
    @report_name = @chart_options[:title]

    haml :report
  end
end
