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
                        tip: 'View my Dribble page'
                    },
                    email: {
                        url: 'mailto:{handle}',
                        tip: 'Send me an e-mail'
                    },
                    facebook: {
                        url: 'http://www.facebook.com/{handle}',
                        tip: 'View my Facebook page',
                        imageUrl: 'https://graph.facebook.com/{handle}/picture?type=large'
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
                        type: 'default',  // Can be 'profile or 'default'
                        name: 'facebook'  // Only needed when type is 'profile'. Requires 'imageUrl' set in the given profile
                    },
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
                        var o = $(this).outerWidth(), l = $(this).outerHeight();
                        var c = el.find('.sbutton:eq(0)').outerWidth(), h = el.find('.sbutton:eq(0)').outerHeight();
                        var p = (o - c) / 2, d = (l - h) / 2;
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('disabled').delay(i).queue(function(e) {
                                $(this).removeClass('disabled').addClass('active');
                                e();
                            });
                            var v = options.arcLength / r, m = options.arcStart + v / 2;
                            el.find('.sbutton').each(function() {
                                var n = m / 180 * Math.PI, r = p + options.arcRadius * Math.cos(n), i = d + options.arcRadius * Math.sin(n);
                                $(this).css({
                                    display: 'block',
                                    left: p + 'px',
                                    top: d + 'px'
                                }).stop().delay(t * s).animate({
                                    left: r + 'px',
                                    top: i + 'px'
                                }, e);
                                m += v;
                                s++;
                            });
                        } else {
                            s = r - 1;
                            $(this).addClass('disabled').delay(i).queue(function(e) {
                                $(this).removeClass('disabled').removeClass('active');
                                e();
                            });
                            el.find('.sbutton').each(function() {
                                $(this).stop().delay(t * s).animate({
                                    left: p,
                                    top: d
                                }, e);
                                s--;
                            });
                        }
                    },
                    linedown: function() {
                        if ($(this).hasClass('disabled')) {
                            return;
                        }
                        var e = 500, t = 250, r = el.find('.sbutton').length, i = options.gap, s = e + (r - 1) * t, o = 1;
                        var a = $(this).outerWidth(), f = $(this).outerHeight();
                        var c = el.find('.sbutton:eq(0)').outerWidth(), h = el.find('.sbutton:eq(0)').outerHeight();
                        var p = (a - c) / 2, d = (f - h) / 2, v = options.arcStart / 180 * Math.PI;
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('disabled').delay(s).queue(function(e) {
                                $(this).removeClass('disabled').addClass('active');
                                e();
                            });
                            el.find('.sbutton').each(function() {
                                var n = p + (p + i * o) * Math.cos(v), r = d + (d + i * o) * Math.sin(v);
                                $(this).css({
                                    display: 'block',
                                    left: d + 'px',
                                    top: p + 'px'
                                }).stop().delay(t * o).animate({
                                    left: r + 'px',
                                    top: n + 'px'
                                }, e);
                                o++;
                            });
                        } else {
                            o = r;
                            $(this).addClass('disabled').delay(s).queue(function(e) {
                                $(this).removeClass('disabled').removeClass('active');
                                e();
                            });
                            el.find('.sbutton').each(function() {
                                $(this).stop().delay(t * o).animate({
                                    left: d,
                                    top: p
                                }, e);
                                o--;
                            });
                        }
                    },
                    line: function() {
                        if ($(this).hasClass('disabled')) {
                            return;
                        }
                        var e = 500, t = 250, r = el.find('.sbutton').length, i = options.gap, s = e + (r - 1) * t, o = 1;
                        var a = $(this).outerWidth(), f = $(this).outerHeight();
                        var c = el.find('.sbutton:eq(0)').outerWidth(), h = el.find('.sbutton:eq(0)').outerHeight();
                        var p = (a - c) / 2, d = (f - h) / 2, v = options.arcStart / 180 * Math.PI;
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('disabled').delay(s).queue(function(e) {
                                $(this).removeClass('disabled').addClass('active');
                                e();
                            });
                            el.find('.sbutton').each(function() {
                                var n = p + (p + i * o) * Math.cos(v), r = d + (d + i * o) * Math.sin(v);
                                $(this).css({
                                    display: 'block',
                                    left: p + 'px',
                                    top: d + 'px'
                                }).stop().delay(t * o).animate({
                                    left: n + 'px',
                                    top: r + 'px'
                                }, e);
                                o++;
                            });
                        } else {
                            o = r;
                            $(this).addClass('disabled').delay(s).queue(function(e) {
                                $(this).removeClass('disabled').removeClass('active');
                                e();
                            });
                            el.find('.sbutton').each(function() {
                                $(this).stop().delay(t * o).animate({
                                    left: p,
                                    top: d
                                }, e);
                                o--;
                            });
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