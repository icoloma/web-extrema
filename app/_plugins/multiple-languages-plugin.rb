# modificación sobre https://github.com/screeninteraction/jekyll-multiple-languages-plugin/
module Jekyll
  class Site
    alias :process_org :process

    def process
      #Variables
      self.config['baseurl_root'] = self.config['baseurl']
      dest_org = self.dest
      baseurl_org = self.baseurl
      languages = self.config['languages']

      #Loop
      self.config['default_lang'] = self.config['lang'] = languages.first
      puts
      puts "Building site for default language: \"#{self.config['lang']}\" to: " + self.dest
      process_org
      languages.drop(1).each do |lang|

        # Build site for language lang
        self.dest = self.dest + "/" + lang
        #self.baseurl = self.baseurl + lang
        self.baseurl += (self.baseurl.match(/.*\/$/)? lang : '/' + lang) + '/'
        self.config['baseurl'] = self.baseurl
        self.config['lang'] = lang
        puts "Building site for language: \"#{self.config['lang']}\" to: " + self.dest
        process_org

        #Reset variables for next language
        self.dest = dest_org
        self.baseurl = baseurl_org
        self.config['baseurl'] = baseurl_org
      end
      puts 'Build complete'
    end
  end

  class LocalizeTag < Liquid::Tag

    def initialize(tag_name, key, tokens)
      super
      @key = key.strip
    end

    def render(context)
      if "#{context[@key]}" != "" #Check for page variable
        key = "#{context[@key]}"
      else
        key = @key
      end
      lang = context.registers[:site].config['lang']
      candidate = YAML.load_file(context.registers[:site].source + "/_i18n/#{lang}.yml")
      path = key.split(/\./) if key.is_a?(String)
      while !path.empty?
        key = path.shift
        if candidate[key]
          candidate = candidate[key]
        else
          candidate = ""
        end
      end
      if candidate == ""
        puts "Missing i18n key: " + lang + ":" + key
        "*" + lang + ":" + key + "*"
      else
        if candidate.is_a?(String)
          candidate
        else
          context[key + '_list'] = candidate
          candidate = ""
        end
      end
    end
  end
end

Liquid::Template.register_tag('t', Jekyll::LocalizeTag)
Liquid::Template.register_tag('translate', Jekyll::LocalizeTag)
