/*!
 * jQuery ClassySocial
 * www.class.pm
 *
 * Written by Marius Stanciu - Sergiu <marius@class.pm>
 * Extended by Gabriel Zanetti - http://github.com/pupi1985
 * Licensed under the MIT license www.class.pm/LICENSE-MIT
 * Version pupi1985-2.3.0
 *
 */
(function($) {
    $.fn.ClassySocial = function(userOptions) {
        var ClassySocial = function(element, userOptions) {
            var defaultOptions = {
                profiles: {
                    blogger: {
                        url: "http://www.blogger.com/profile/{handle}",
                        tip: 'View my Blogger profile'
                    },
                    deviantart: {
                        url: 'https://{handle}.deviantart.com',
                        tip: 'Check out my DeviantArt page'
                    },
                    dribbble: {
                        url: 'http://dribbble.com/{handle}',
                        tip: 'View my Dribbble page'
                    },
                    email: {
                        url: 'mailto:{handle}',
                        tip: 'Send me an e-mail'
                    },
                    facebook: {
                        url: 'http://www.facebook.com/{handle}',
                        tip: 'View my Facebook page'
                    },
                    flickr: {
                        url: 'http://www.flickr.com/photos/{handle}',
                        tip: 'View my Flickr images'
                    },
                    github: {
                        url: "https://www.github.com/{handle}",
                        tip: 'View my GitHub developer profile'
                    },
                    googleplus: {
                        url: 'https://plus.google.com/{handle}',
                        tip: 'View my Google Plus profile'
                    },
                    instagram: {
                        url: 'http://instagram.com/{handle}',
                        tip: 'View my Instagram profile'
                    },
                    linkedin: {
                        url: 'http://www.linkedin.com/profile/view?id={handle}',
                        tip: 'View my LinkedIn profile'
                    },
                    pinterest: {
                        url: 'http://pinterest.com/{handle}',
                        tip: 'View my Pinterest profile'
                    },
                    skype: {
                        url: 'skype:{handle}?userinfo',
                        tip: 'Call me on Skype'
                    },
                    socl: {
                        url: 'http://www.so.cl/#/profile/{handle}',
                        tip: 'View my Socl profile'
                    },
                    steam: {
                        url: 'http://steamcommunity.com/profiles/{handle}',
                        tip: 'View my Steam profile'
                    },
                    twitter: {
                        url: 'https://twitter.com/{handle}',
                        tip: 'Check out my Twitter profile'
                    },
                    vimeo: {
                        url: 'http://vimeo.com/{handle}',
                        tip: 'View my Vimeo profile'
                    },
                    wordpress: {
                        url: 'http://{handle}.wordpress.com',
                        tip: 'View my wordpress.com profile'
                    },
                    yahoo: {
                        url: 'http://profile.yahoo.com/y/pulse/{handle}',
                        tip: 'Check out my Yahoo profile'
                    },
                    youtube: {
                        url: 'http://www.youtube.com/user/{handle}',
                        tip: 'Check out my Youtube profile'
                    }
                },
                mainButton: {
                    tip: 'Find me here!',
                    image: {
                        type: 'default',  // Can be 'profile' or 'default'
                        name: 'facebook'  // Only needed when type is 'profile'. Requires 'imageUrl' set in the given profile
                    }
                },
                theme: 'default',
                orientation: 'arc',
                arcStart: 0,
                arcLength: 360,
                arcRadius: 80,
                gap: 80
            };

            var options = {};
            $.extend(true, options, defaultOptions, userOptions);

            var el = $(element);
            var imageUrl = null;

            this.__constructor = function() {
                el.addClass('bubble');
                var template = this.template;
                var containerTemplate = template.containerWithoutProfileImage;
                if (options.mainButton.image.type === 'profile') {
                    var profileId = options.mainButton.image.name;
                    var profileImage = options.profiles[profileId].imageUrl;
                    if (profileImage) {
                        imageUrl = profileImage.replace(/\{handle\}/gi, options.profiles[profileId].handle);
                        containerTemplate = template.containerWithProfileImage;
                    }
                }
                el.html(containerTemplate
                    .replace(/\{mainButtonImageUrl\}/gi, imageUrl)
                    .replace(/\{theme\}/gi, options.theme)
                    .replace(/\{mainButtonTip\}/gi, options.mainButton.tip)
                );
                var container = el.find(".scontainer");
                $.each(options.profiles, function(profileKey, profile){
                    if (profile.url && profile.handle) {
                        var u = profile.url.replace(/\{handle\}/gi, profile.handle);
                        var a = template.button
                            .replace(/\{url\}/gi, u)
                            .replace(/\{tip\}/gi, profile.tip)
                            .replace(/\{network\}/gi, profileKey)
                        ;
                        container.append($(a));
                    }

                });
                return this._build(template);
            };

            this._build = function(template) {
                var orientationFunction = template.orientations[options.orientation];
                el.find('.smain').click(orientationFunction);
                return this;
            };

			var _orientationDisable = function(element, e, i, s, p, d, t) {
				$(element).addClass('disabled').delay(i).queue(function(e1) {
					$(this).removeClass('disabled').removeClass('active');
					e1();
				});
				el.find('.sbutton').each(function() {
					$(this).stop().delay(t * s).animate({
						left: p,
						top: d
					}, e);
					s--;
				});
            };

			var _orientationActivate = function(element, p, d, delay, n, r, e) {
				$(element).css({
					display: 'block',
					left: p + 'px',
					top: d + 'px'
				}).stop().delay(delay).animate({
					left: n + 'px',
					top: r + 'px'
				}, e);
            };


            this.template = {
                containerWithProfileImage:
                    '<a class="smain {theme}" title="{mainButtonTip}" alt="{mainButtonTip}">' +
                        '<img src="{mainButtonImageUrl}" title="{mainButtonTip}" alt="{mainButtonTip}"/>' +
                    '</a>' +
                    '<div class="scontainer {theme}"></div>',
                containerWithoutProfileImage:
                    '<span class="smain {theme} default-image" title="{mainButtonTip}" alt="{mainButtonTip}"></span>' +
                    '<div class="scontainer {theme}"></div>',
                button: '<a class="sbutton {network}" title="{tip}" target="_blank" href="{url}"></a>',
                orientations: {
                    arc: function() {
                        if ($(this).hasClass('disabled')) {
                            return;
                        }
                        var e = 250, t = 250, r = el.find('.sbutton').length, i = e + (r - 1) * t, s = 0;
                        var p = ($(this).outerWidth() - el.find('.sbutton:eq(0)').outerWidth()) / 2;
						var d = ($(this).outerHeight() - el.find('.sbutton:eq(0)').outerHeight()) / 2;

                        if (!$(this).hasClass('active')) {
                            $(this).addClass('disabled').delay(i).queue(function(e) {
                                $(this).removeClass('disabled').addClass('active');
                                e();
                            });
                            var v = options.arcLength / r
							var m = options.arcStart + v / 2;
                            el.find('.sbutton').each(function() {
                                var n = m / 180 * Math.PI;
								var r = p + options.arcRadius * Math.cos(n);
								var i = d + options.arcRadius * Math.sin(n);
								_orientationActivate(this, p, d, t * s, r, i, e);
                                m += v;
                                s++;
                            });
                        } else {
							_orientationDisable(this, e, i, r - 1, p, d, t);
                        }
                    },
                    line: function() {
                        if ($(this).hasClass('disabled')) {
                            return;
                        }
                        var e = 500, t = 250, r = el.find('.sbutton').length, i = e + (r - 1) * t, s = 1;
                        var p = ($(this).outerWidth() - el.find('.sbutton:eq(0)').outerWidth()) / 2;
						var d = ($(this).outerHeight() - el.find('.sbutton:eq(0)').outerHeight()) / 2;
						var v = options.arcStart / 180 * Math.PI;

                        if (!$(this).hasClass('active')) {
                            $(this).addClass('disabled').delay(i).queue(function(e) {
                                $(this).removeClass('disabled').addClass('active');
                                e();
                            });
                            el.find('.sbutton').each(function() {
								var gap = options.gap * s;
                                var n = p + (p + gap) * Math.cos(v);
								var r = d + (d + gap) * Math.sin(v);
								_orientationActivate(this, p, d, t * s, n, r, e);
                                s++;
                            });
                        } else {
							_orientationDisable(this, e, i, r, p, d, t);
                        }
                    }
                }
            };
            return this.__constructor();
        };
        return this.each(function() {
            return new ClassySocial(this, userOptions);
        });
    };
})(jQuery);