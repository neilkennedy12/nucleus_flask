<?php /* Template Name: Equity Case Studies Template */ ?>
<?php
	get_header();
	the_post();
	extract(get_fields());
?>
<main class="research-page roi-case-studies-page">
	<section class="page-banner has-background-image">
		<div class="background-image">
			<?php if ( isset($_pb_image) && !empty($_pb_image) ) : ?>
				<div class="bg-img-regular" style="background-image: url(<?php echo $_pb_image ?>)"></div>
			<?php endif ?>
			<?php if ( isset($_pb_image_2x) && !empty($_pb_image_2x) ) : ?>
				<div class="bg-img-retina" style="background-image: url(<?php echo $_pb_image_2x ?>)"></div>
			<?php endif ?>
		</div>
		<div class="text-wrap container-fluid">
			<h1 class="animated fadeInDown"><?php echo (isset($pb_title) && !empty($pb_title)) ? $pb_title : get_the_title(); ?></h1>
		</div>
	</section><!-- end page banner -->
	<section class="map-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="text-wrap animated fadeIn" style="animation-delay: 0.25s">
						<?php echo wpautop(get_the_content()); ?>
          </div>
        </div>
        <div class="col-lg-6 image-col animated fadeIn" style="animation-delay: 0.5s">
        	<!-- Removed map (Supp Ticket #218330)
          <div id="map" class="image-wrap" style="top: 0;	left: 0;width: 100%;height: 100%;">-->
          	<img src="https://nucleusresearch.com/wp-content/uploads/2020/12/equity_snapshot.jpg" class="image-wrap" style="top: 0; left: 0; width: 100%; height: 100%;"/>
 
          </div>
        </div>
      </div>
    </div>
  </section>
	<div class="filter-bar">
		<div class="container">
			<p class="filter-nav">Filter Results</p>
			<?php $paged = get_query_var('paged', 1); ?>
			<form class="filter-nav-wrap" action="<?php the_permalink(); ?>" method="POST" id="ajaxFilter">
				<input type="hidden" name="action" value="get_entries" />
				<input type="hidden" name="post_type" value="nucleus_research" />
				<input type="hidden" name="template" value="research" />
				<input type="hidden" name="research_category[]" value="equity" />
				<input type="hidden" name="hasMap" value="yes" />
				<input type="hidden" name="paged" value="1" />
				<div class="topic-search-wrap">
					<div class="form-group">
						<?php
						$taxonomies = get_terms(array(
							'taxonomy' => 'topic',
							'hide_empty' => false
						));

						if (!empty($taxonomies)) :
							$output = '<select class="form-control selectpicker preventdefault" id="sel1" name="topic">';
							$output .= '<option value="" selected>All Topics</option>';
							foreach ($taxonomies as $category) {
								$output .= '<option value="' . esc_attr($category->slug) . '">
								' . esc_html($category->name) . '</option>';
							}
							$output .= '</select>';
							echo $output;
						endif; ?>
					</div>
					<div class="search-form-container">
						<input class="search-button" type="submit" value="Search">
						<input type="search" class="search-field" placeholder="Search" name="keyword">
					</div>
				</div>
			</form>
		</div>
	</div>

	<section class="listing-container">
		<div class="container">
			<div id="listing" class="groupScrollAnimate">
				<?php echo do_shortcode('[research_by_cat category="equity" template="research" hasMap="yes"]'); ?>
			</div>
			<div class="loader-animation">
				<img src="<?php echo get_template_directory_uri() ?>/assets/images/loader.svg" alt="loader">
			</div>
		</div>
	</section>
</main>

<?php get_footer(); ?>